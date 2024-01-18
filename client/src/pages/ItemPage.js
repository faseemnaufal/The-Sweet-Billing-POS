import React, { useEffect, useState } from 'react'
import DefaultLayout from '../components/DefaultLayout'
import { useDispatch } from 'react-redux'
import {DeleteOutlined,EditOutlined} from '@ant-design/icons'
import axios from 'axios'
import { Button, Form, Input, Modal, Select, Table, message } from 'antd'

const ItemPage = () => {
  const dispatch = useDispatch()
  const [itemData,setItemData] = useState([])
  const [popupModal, setPopupModal] = useState(false)
  const [editItem, setEditItem] = useState(null)

  const getAllItems = async () =>{
    try {
        dispatch({
            type:'SHOW_LOADING'
        })
        const {data} = await axios.get('/api/items/get-item')
        setItemData(data)
        dispatch({
            type: "HIDE_LOADING"
        })
        console.log(data)
    } catch (error) {
        console.log(error)
    }
  }
  useEffect(() => {
    
    getAllItems()
  },[])

  //handle delete
  const handleDelete = async(record) =>{
    try {
      dispatch({
          type:'SHOW_LOADING'
      })
      await axios.post('/api/items/delete-item', {itemId:record._id})
      message.success('Item Deleted Successfully')
      getAllItems()
      setPopupModal(false)
      dispatch({
          type: "HIDE_LOADING"
      })
      
    } catch (error) {
      message.error('Something went wrong')
      console.log(error)
    }
  }
  //table data
  const columns = [
    {title:'Name', dataIndex:'name'},
    {title:'Image', dataIndex:'image', render:(image,record)=>
         <img src={image} alt={record.name} height='60' width='60'/>},
    {title:'Cost', dataIndex:'cost'},
    {title:'Price', dataIndex:'price'},
    {title:'Actions', dataIndex:'_id', render:(id,record)=>
    <div>
      <EditOutlined 
        style={{cursor:'pointer'}}
        onClick={() =>{
          setEditItem(record)
          setPopupModal(true)
      }}
      />
      <DeleteOutlined  
        style={{cursor:'pointer'}}
        onClick={() =>{
          handleDelete(record)
        }} 
      />
    </div>
    },
  ] 

  const handleSubmit = async (value) =>{
    if(editItem === null){
      try {
        dispatch({
            type:'SHOW_LOADING'
        })
        const res = await axios.post('/api/items/add-item', value)
        message.success('Item Added Successfully')
        getAllItems()
        setPopupModal(false)
        dispatch({
            type: "HIDE_LOADING"
        })
        
      } catch (error) {
        message.error('Something went wrong')
        console.log(error)
      }
    }else{
      try {
        dispatch({
            type:'SHOW_LOADING'
        })
        await axios.put('/api/items/edit-item', {...value, itemId:editItem._id})
        message.success('Item Updated Successfully')
        getAllItems()
        setPopupModal(false)
        dispatch({
            type: "HIDE_LOADING"
        })
        
      } catch (error) {
        message.error('Something went wrong')
        console.log(error)
      }
    }
    
  }

  return (
    <DefaultLayout>
      <div className='d-flex justify-content-between'>
        <h1>Item List</h1>
        <Button type='primary' onClick={() => setPopupModal(true)}>
          Add Item
        </Button>
      </div>
      <Table columns={columns} dataSource={itemData} bordered/>

      {
        popupModal && (
          <Modal title={`${editItem !== null ? 'Edit Item': 'Add New Item'}`} 
            open={popupModal} 
            onCancel={() => {
              setEditItem(null)
              setPopupModal(false)}} 
              footer={false}
            >
            <Form layout='vertical' initialValues={editItem} onFinish={handleSubmit}>
              <Form.Item name='name' label='Name'>
                <Input/>
              </Form.Item>
              <Form.Item name='cost' label='Cost'>
                <Input/>
              </Form.Item>
              <Form.Item name='price' label='Price'>
                <Input/>
              </Form.Item>
              <Form.Item name='image' label='Image URL'>
                <Input/>
              </Form.Item>
              <Form.Item name='category' label='Category'>
                <Select>
                  <Select.Option value='drinks'>Drinks</Select.Option>
                  <Select.Option value='food'>Food</Select.Option>
                  <Select.Option value='chocolate'>Chocolate</Select.Option>
                  <Select.Option value='others'>Others</Select.Option>
                </Select>
              </Form.Item>
              <div className='d-flex justify-content-end'>
                <Button type='primary' htmlType='submit'>
                  SAVE
                </Button>
              </div>
            </Form>
          </Modal>

        )
      }
      
    </DefaultLayout>
  )
}

export default ItemPage
