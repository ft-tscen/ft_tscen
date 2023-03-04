import { useEffect, useState } from "react";
import { api } from "../axios/api";




function Avatar() {

    // avatar 업로드 코드
    const [file, setFile] = useState<string | Blob>();

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = (e: any) => {
    if (file) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file!);
        api.post('/user/avatar', formData)
            .then(response => console.log(response))
            .catch(error => console.error(error));
    }
    };

    // avatar 가져오는 코드
    const [imageDataUrl, setImageDataUrl] = useState<string>();

    const getUserData = async () => {
        const res = await api.get("/user/me");
        const { user } = res.data;
        api.get(`/user/avatar/${user.avatarId}`, { responseType: 'arraybuffer' })
        .then(response => {
            const arrayBufferView = new Uint8Array(response.data);
            const blob = new Blob([arrayBufferView], { type: 'image/jpeg' });
            const urlCreator = window.URL || window.webkitURL;
            const imageUrl = urlCreator.createObjectURL(blob);
            setImageDataUrl(imageUrl);
        })
        .catch(error => console.error(error));
    }
    useEffect(() => {
        getUserData();
    }, []);


    return <>
        <div style={{display: 'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', height:'100vh'}}>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange}></input>
                <button type="submit">Upload</button>
            </form>
            <div>
                {imageDataUrl && (
                <img src={imageDataUrl} alt="avatar" />
                )}
            </div>
        </div>
    </>
}
export default Avatar;