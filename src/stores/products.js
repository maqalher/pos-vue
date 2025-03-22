import { computed, ref } from "vue";
import { defineStore } from "pinia";
import { useFirestore, useCollection, useFirebaseStorage } from "vuefire";
import { collection, addDoc, where, query, limit, orderBy, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";

export const useProductsStore = defineStore('products', () => {

    const db = useFirestore()
    const storage = useFirebaseStorage()

    const selectedCategory = ref(1)
    const categories = [
        { id: 1, name: 'Sudaderas'},
        { id: 2, name: 'Tenis'},
        { id: 3, name: 'Lentes'},
    ]

    const q = query(
        collection(db, 'products'),
        orderBy('availability', 'asc')
    )
    const productsCollection = useCollection(q)

    async function createProduct(product) {
        // console.log(product);
        await addDoc(collection(db, 'products'), product)
    }

    async function updateProduct(docRef, product) {
        // console.log(product);
        const {image, url, ...values } = product

        if(image.length){
            await updateDoc(docRef, {
                ...values,
                image: url.value
            })
        }else{
            await updateDoc(docRef, values)
        }
    }

    async function deleteProduct(id) {
        if(confirm('Eliminar Producto?')){
            const docRef = doc(db, 'products', id)
            // console.log(docRef);
            
            // const docSnap = await getDoc(docRef) // referencia a la imagen
            // const {image} = docSnap.data() // referencia a la imagen
            // const imageRef = storageRef(storage,image) // Eliminar imagen

            deleteDoc(docRef) // Eliminar producto
            // await Promise.all([
            //     deleteDoc(docRef), // Eliminar producto
            //     deleteObject(imageRef) // Eliminar imagen
            // ])
        }
        
    }

    const categoryOptions = computed(() => {
        const options = [
            {label: 'Seleccione', value: '', attrs: {disabled: true}},
            ...categories.map(category => (
                {label: category.name, value: category.id}
            ))
        ]
        return options
    })

    const noResults = computed(() => productsCollection.value.length === 0)

    const filterProducts = computed( () => {
        return productsCollection.value
        .filter( product => product.category === selectedCategory.value)
        .filter( product => product.availability > 0)
    })

    return {
        categoryOptions,
        productsCollection,
        createProduct,
        noResults,
        categories,
        selectedCategory,
        updateProduct,
        deleteProduct,
        filterProducts
    }
})