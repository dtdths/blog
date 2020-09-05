import { useState } from "react"
import { createContainer } from "unstated-next"

function useApiList(initialState = []) {
   const [apiList, setApiList] = useState(initialState)

   return { apiList, setApiList }
}

let ApiListContainer = createContainer(useApiList)
export default ApiListContainer