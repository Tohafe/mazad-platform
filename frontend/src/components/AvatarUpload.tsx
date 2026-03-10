import Dropzone from "./Form/DropZone"

export default function AvatarUpload(){
    return (
        <div className="z-10 w-60 sm:w-80 bg-white">
            <Dropzone onFilesSelected={() => {console.log('a file selected')}}></Dropzone>
        </div>
    )
}