// import { uid } from "uid";
import { ref, computed } from "vue";
import { UploadClient } from "@uploadcare/upload-client";
// import { useFirebaseStorage } from "vuefire";
// import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";

// Inicializar Uploadcare con tu Public Key
// https://app.uploadcare.com/projects/d41f9c00622a0da52621/files/c91c7a8b-babf-464c-81f3-b0067f323500/
const client = new UploadClient({ publicKey: "d41f9c00622a0da52621" });

const imageUrl = ref(null);
const url = ref('')


export default function useImage() {

    // const storage = useFirebaseStorage()
    
    // const onFileChange = e => {
    //     // console.log(e.target.files);
    //     // console.log(e.target.files[0]);
    //     const file = e.target.files[0]
    //     const filename = uid() + '.jpg'
    //     const sRef = storageRef(storage, '/products/' + filename)

    //     // Sube el archivo
    //     const uploadTask = uploadBytesResumable(sRef, file)

    //     uploadTask.on('state_changed',
    //         () => {},
    //         (error) => console.log(error),
    //         () => {
    //             // console.log(uploadTask.snapshot.ref);
    //             // La imagen ya se subio
    //             getDownloadURL(uploadTask.snapshot.ref)
    //                 .then((downloadURL) => {
    //                     console.log(downloadURL);
                        
    //                 })
    //         }
    //     )

        
    // }

    // con cloudinary
    const onFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;
      
        try {
          const { cdnUrl } = await client.uploadFile(file);
          imageUrl.value = cdnUrl; // Guarda la URL de la imagen subida
          url.value = cdnUrl
        //   console.log("Imagen subida:", cdnUrl);
        } catch (error) {
          console.error("Error al subir imagen:", error);
        }
    };

    const isImageUploaded = computed(() => {
        return url.value ? url.value : null
    })

    return{
        url,
        onFileChange,
        isImageUploaded
    }
}