import axios from 'axios';

//Fetch All users
export const getUsers=async()=>{
    return axios.get("/users")
}


//Update user role /clearnace
export const updateUser=async(id:number, data:any)=>{
    return axios.put(`/users/${id}`,data)
}

//DeactivateUser
export const deactivateUser=async(id:number)=>{
    return axios.patch(`/user/${id}/deactivate`)
}
//Reset Password
export const resetPassword=async(id:number)=>{
    return axios.post(`/user/${id}/resetpassword`)
}