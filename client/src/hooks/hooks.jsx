import { useEffect, useState } from "react"
import toast from "react-hot-toast"

const useErrors = (errors=[]) => {
   useEffect(()=>{
    errors.forEach(({isError,error,fallback})=>{
      if(isError){
        if(fallback) fallback()
        else toast.error(error?.response?.data?.message || "Something went wrong")
      }
    })
   },[errors])
}

const useAsyncMutation = (mutationHook) => {
    const [isLoading , setIsLoading] = useState(false)
    const [data , setData] = useState(null)

    const [mutate] = mutationHook()

    const executeMutation = async(toastMessage , ...args)=>{
       setIsLoading(true)
       const toastId = toast.loading(toastMessage || "Updating data ")
       console.log("in async mutuaion ",toastMessage,args)
       try {
        const res=await mutate(...args)
        console.log("in async mutation res ", res)
        if(res.data){
          toast.success(res?.data?.message || "Data updated successfully",{
            id:toastId
          })
          setData(res.data)
        }else{
          toast.error(res?.error?.data?.message || "Something went wrong ",{
            id:toastId
          })
        }
      } catch (error) {
        console.log("in async mutation res ", error)
        toast.error("Something went wrong ",{
            id:toastId
          })
      }finally{
        setIsLoading(false)
       }
    }

    return [executeMutation , isLoading , data]
}

const useSocketEvents = (socket,handlers) => {   //handlers - object with event name as key and callback func as value
    useEffect(()=>{
      console.log("in useSocketEvents ",socket,handlers)
      Object.entries(handlers).forEach(([event,handler])=>{
         socket.on(event,handler)
      })

    return ()=>{
      Object.entries(handlers).forEach(([event,handler])=>{
         socket.off(event,handler)
      })
    }
  },[])
}

export {useErrors , useAsyncMutation ,useSocketEvents}