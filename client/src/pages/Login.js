import React, {useEffect} from 'react'
import { Button, Form, Input } from 'antd'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import axios from 'axios'
import {useDispatch} from 'react-redux'

const Login = () => {
    
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleSubmit = async (value)=>{
      try {
        dispatch({
          type: 'SHOW_LOADING',
        });
    
        const res = await axios.post('/api/users/login', value);
    
        dispatch({ type: 'HIDE_LOADING' });
    
        if (res.data && res.data.user !== null) {
          // If login is successful
          message.success('User Login Successfully');
          localStorage.setItem('auth', JSON.stringify(res.data));
          navigate('/');
        } else {
          // If login fails
          message.error('Login failed. Please check your credentials.');
        }
      } catch (error) {
        message.error('Something went wrong');
        console.log(error);
      }
    }

        //currently login user
        useEffect(()=>{
            if(localStorage.getItem("auth")){
                localStorage.getItem("auth")
                navigate("/")
            }
            
        }, [navigate])

  return (
    <>
      <div className='register'>
        <div className='register-form'>
            <h1>POS APP</h1>
            <h3>Login Page</h3>
            <Form layout='vertical'  onFinish={handleSubmit}>
              <Form.Item name='userId' label='User ID'>
                <Input/>
              </Form.Item>
              <Form.Item name='password' label='Password'>
                <Input type='password'/>
              </Form.Item>
             
              <div className='d-flex justify-content-between'>
                {/* <p>
                    not a user Please
                    <Link to="/register"> Register Here</Link>
                </p> */}
                <Button type='primary' htmlType='submit'>
                  Login
                </Button>
              </div>
            </Form>
        </div>
      </div>
    </>
  )
}

export default Login
