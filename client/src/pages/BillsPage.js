import React, { useEffect, useState, useRef } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useDispatch } from 'react-redux'
import {EyeOutlined} from '@ant-design/icons'
import axios from 'axios'
import {  Button, Modal, Table} from 'antd'
import { useReactToPrint } from 'react-to-print'
import "../styles/InvoiceStyles.css";

const BillsPage = () => {

    const componentRef = useRef()
    const dispatch = useDispatch()
    const [billsData,setBillsData] = useState([])
    const [popupModal, setPopupModal] = useState(false)
    const [selectedBill, setSelectedBill] = useState(null)
  
    const getAllBills = async () =>{
      try {
          dispatch({
              type:'SHOW_LOADING'
          })
          const {data} = await axios.get('/api/bills/get-bills')
          setBillsData(data)
          dispatch({
              type: "HIDE_LOADING"
          })
          console.log(data)
      } catch (error) {
          console.log(error)
      }
    }
    // useEffect(() => {
      
    //   getAllBills()
    // },[])

    //print function
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    })
  
    
    //table data
    const columns = [
      {title:'ID', dataIndex:'_id'},
      {title:'Customer Name', dataIndex:'customerName'},
      {title:'Contact Number', dataIndex:'customerContact'},
      {title:'Sub Total', dataIndex:'subTotal'},
      {title:'Discount', dataIndex:'discount'},
      {title:'Total Amount', dataIndex:'totalAmount'},
      {
        title:'Actions', dataIndex:'_id', 
        render:(id,record)=>(
        <div>
            <EyeOutlined style={{cursor:'pointer'}}
            onClick={() =>{
                setSelectedBill(record)
                setPopupModal(true)
            }}
            />
        </div>
        ),
      },
    ] 

  
  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between'>
        <h1>Invoice List</h1>
      </div>
      <Table columns={columns} dataSource={billsData} bordered/>

      {
        popupModal && (
          <Modal title='Invoice Details' 
            open={popupModal} 
            onCancel={() => {
            
              setPopupModal(false)}} 
              footer={false}
            >
            
            {/* invoice print */}
            <div id='invoice-POS' ref={componentRef}>
                <center id='top'>
                    <div className='logo' />
                    <div className='info'>
                        <h2>The Sweet</h2>
                        <p>Contact : 0766279199 | 72, Colombo rd, Merawala, Chilaw</p>
                    </div>
                </center>

                <div id='mid'>
                    <div className='mt-2'>
                        <p>
                            Customer Name : <b>{selectedBill.customerName}</b>
                            <br />
                            Phone No : <b>{selectedBill.customerContact}</b>
                            <br />
                            Date : <b>{selectedBill.date.toString().substring(0, 10)}</b>
                            <br />
                        </p>
                        <hr style={{margin: "5px"}} />
                    </div>
                </div>

                <div id='bot'>
                    <div id='table'>
                        <table>
                            <tbody>
                                <tr className='tabletitle'>
                                    <td className='item'>
                                        <h2>Item</h2>
                                    </td>
                                    <td className='Hours'>
                                        <h2>Qty</h2>
                                    </td>
                                    <td className='Rate'>
                                        <h2>Price</h2>
                                    </td>
                                    <td className='Rate'>
                                        <h2>Total</h2>
                                    </td>
                                </tr>
                                {selectedBill.cartItems.map((item) => (
                                    <>
                                        <tr className='service'>
                                            <td className='tableitem'>
                                                <p className='itemtext'>{item.name}</p>
                                            </td>
                                            <td className='tableitem'>
                                                <p className='itemtext'>{item.quantity}</p>
                                            </td>
                                            <td className='tableitem'>
                                                <p className='itemtext'>{item.price}</p>
                                            </td>
                                            <td className='tableitem'>
                                                <p className='itemtext'>
                                                    {item.quantity * item.price}
                                                </p>
                                            </td>
                                        </tr>
                                    </>
                                ))}

                                <tr className='tabletitle'>
                                    <td />
                                    <td />
                                    <td className='Rate'>
                                        <h2>discount</h2>
                                    </td>
                                    <td className='payment'>
                                        <h2>Rs: {selectedBill.discount}</h2>
                                    </td>
                                </tr>
                                <tr className='tabletitle'>
                                    <td />
                                    <td />
                                    <td className='Rate'>
                                        <h2>Grand Total </h2>
                                    </td>
                                    <td className='payment'>
                                        <h2>
                                            <b> Rs: {selectedBill.totalAmount}</b>
                                        </h2>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div id='legalcopy'>
                        <p className='legal'>
                            <strong>Thank you</strong>
                            <br />
                            <span>the_sweet.lk/Instagram</span>
                        </p>              
                    </div>
                </div>

            </div>
            <div className='d-flex justify-content-end mt-3'>
                <Button type='primary' onClick={handlePrint}>Print</Button>
            </div>
            
          </Modal>
        )
      }
    </DefaultLayout>
  )
}

export default BillsPage
