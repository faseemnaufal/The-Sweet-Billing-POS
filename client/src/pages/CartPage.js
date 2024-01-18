import React, { useState,useEffect } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useSelector,useDispatch } from 'react-redux'
import {DeleteOutlined,PlusCircleOutlined,MinusCircleOutlined} from '@ant-design/icons'
import { Button, Form, Input, Modal, Select, Table, message } from 'antd'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../assets/API_URL';

const CartPage = () => {
    const [subTotal, setSubTotal] = useState(0)
    const [discount, setDiscount] = useState(0); // New state for manual discount
    const [billPopup, setBillPopup] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const {cartItems} = useSelector(state => state.rootReducer)

    //handle increment
    const handleIncrement = (record) =>{
        dispatch({
            type:'UPDATE_CART',
            payload:{...record, quantity: record.quantity + 1},
        })
    }
    const handleDecrement = (record) =>{
        if(record.quantity !== 1){
            dispatch({
                type:'UPDATE_CART',
                payload:{...record, quantity: record.quantity - 1},
            })
        }
    }

    const columns = [
        {title:'Name', dataIndex:'name'},
        {title:'Image', dataIndex:'image', render:(image,record)=>
             <img src={image} alt={record.name} height='60' width='60'/>},
        {title:'Price', dataIndex:'price'},
        {title:'Quantity', dataIndex:'_id',
            render: (id,record) =>(
                <div>
                    <PlusCircleOutlined 
                        className='mx-3'
                        style={{cursor:'pointer'}}
                        onClick={() => handleIncrement(record)}    
                    />
                    <b>{record.quantity}</b>
                    <MinusCircleOutlined 
                        className='mx-3'
                        style={{cursor:'pointer'}}
                        onClick={() => handleDecrement(record)}
                    />
                </div>
            )},
        {title:'Actions', dataIndex:'_id', render:(id,record)=>(<DeleteOutlined  style={{cursor:'pointer'}}
            onClick={() => dispatch({
                type:'DELETE_FROM_CART',
                payload:record,
            }) }/>
        ),
        },
    ]

    useEffect(() =>{
        let temp = 0
        cartItems.forEach((item) => (temp = temp + item.price * item.quantity))
        setSubTotal(temp)
    }, [cartItems])

    //taxxxxx
    //handleSubmit
    const handleSubmit = async (value) =>{
        try{
            const newObject = {
                ...value,
                cartItems,
                subTotal,
                discount, // Use the manual discount
                totalAmount: Number(subTotal) - Number(discount), // Adjust the total calculation
                userId: JSON.parse(localStorage.getItem("auth"))._id,
            }
            //console.log(newObject)
            await axios.post(`${API_URL}api/bills/add-bills`, newObject)
            message.success("Bill Generated")
            navigate('/bills')
        }catch (error){
            message.error('Something went wrong')
            console.log(error)
        }
        
    }

  return (
    <DefaultLayout>
        <h1>Cart Page</h1>
        <Table columns={columns} dataSource={cartItems} bordered/>
        <div className='d-flex flex-column align-items-end'>
            <hr />
            <h3>
                SUB TOTAL : LKR <b> {subTotal}</b> /-{" "}
            </h3>
            <div className='d-flex align-items-center mb-3'>
                    <Input
                        type='number'
                        placeholder='Discount'
                        value={discount}
                        onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                        style={{ marginRight: '10px' }}
                    />
                    {/* <Button
                        type='primary'
                        icon={<PlusOutlined />}
                        onClick={() => setDiscount(discount + 1)}
                    />
                    <Button
                        type='primary'
                        icon={<MinusOutlined />}
                        onClick={() => setDiscount(Math.max(discount - 1, 0))}
                        style={{ marginLeft: '10px' }}
                    /> */}
                </div>
            <Button type='primary' onClick={() => setBillPopup(true)}>
                Create Invoice
            </Button>
        </div>
        <Modal 
            title="Create Invoice"
            open={billPopup}
            onCancel={() => setBillPopup(false)}
            footer={false}
        >
            <Form layout='vertical'  onFinish={handleSubmit}>
              <Form.Item name='customerName' label='Customer Name'>
                <Input/>
              </Form.Item>
              <Form.Item name='customerContact' label='Contact Number'>
                <Input/>
              </Form.Item>
              <Form.Item name='paymentMode' label='Payment Method'>
                <Select>
                  <Select.Option value='cash'>Cash</Select.Option>
                  <Select.Option value='card'>Card</Select.Option>
                </Select>
              </Form.Item>
                {/* Manual discount input */}
                {/* <Form.Item name='discount' label='Discount'>
                    <Input type='number' placeholder='Discount' />
                </Form.Item> */}

              {/* tax */}
              <div className='bill-item'>
                <h5>
                    Sub Total : <b>{subTotal}</b>
                </h5>
                <h4>
                    Discount
                    <b>{discount.toFixed(2)}</b> {/* Use the user-entered discount value */}
                </h4>
                <h3>
                    GRAND TOTAL -{" "} 
                    <b>
                         {Number(subTotal) - Number(discount.toFixed(2))}
                        {/* {Number(subTotal)} */}
                    </b>
                </h3>
              </div>
              <div className='d-flex justify-content-end'>
                <Button type='primary' htmlType='submit'>
                  Generate Bill
                </Button>
              </div>
            </Form>
        </Modal>
    </DefaultLayout>
  )
}

export default CartPage
