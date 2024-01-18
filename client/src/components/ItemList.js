import React from 'react'
import { Button, Card } from 'antd'
import { useDispatch } from 'react-redux'


const ItemList = ({item}) => {
  const dispatch = useDispatch()
  //update cart handler
  const handleAddToCart = ()=>{
    dispatch({
      type: 'ADD_TO_CART',
      payload:{...item, quantity:1},
    })
  }
  const { Meta } = Card;
  return (
    <div>
      <Card
        hoverable
        style={{
          width: 220, marginBottom: 20
        }}
        cover={<img alt={item.name} src={item.image} style={{height: 200}}/>}
      >
        {/* <Meta title={`${item.name} - $${item.price}`} /> */}
        <Meta
          title={
            <div>
              <div style={{ textAlign: 'center' }}>{item.name}</div>
              <div style={{ textAlign: 'center' }}>cost: {item.cost}</div>
              <div style={{ textAlign: 'center' }}>Rs: {item.price}</div>
            </div>
          }
        />
        <div className='item-button'>
          <Button onClick={() => handleAddToCart()}>Add to cart</Button>
        </div>
      </Card>
    </div>
  )
}

export default ItemList
