import { collection, getDocs } from "firebase/firestore";
import { fireStore } from "../_components/firebase/config";


const SSRPage = async () => {

    const productsRef = collection(fireStore, "create_Product");
    const querySnapshot = await getDocs(productsRef);
    let products = querySnapshot.docs.map(doc => {
        return { id: doc.id, ...doc.data() }
    })


    return <>

        {products.map(a => {
            return <div>
                {a.productData.productInfo.productName}
            </div>
        })}
    </>
}


export default SSRPage;