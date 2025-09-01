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

//ReactivateUser
export const reactivateUser=async(id:number)=>{
    return axios.patch(`/user/${id}/reactivate`)
}

//DeleteUser
export const deleteUser=async(id:number)=>{
    return axios.delete(`/user/${id}`)
}

//Reset Password
export const resetPassword=async(id:number,newPassword: string)=>{
    return axios.post(`/user/${id}/resetpassword`,{'new_password':newPassword})
}