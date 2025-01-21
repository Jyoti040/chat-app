const fileFormat = (url) => {

    const fileExt = url.split('.').pop()

    if(fileExt==='mp4' || fileExt==='ogg' || fileExt==='webm') return 'video';

    if(fileExt==='mp3' || fileExt==='wav' ) return 'audio';
    if(fileExt==='jpg' || fileExt==='jpeg' || fileExt==='png' || fileExt==='gif') return 'image';

    return 'file'
}

const transformImage = (url="",width=100) => {
   const newUrl = url.replace("upload/",`upload/dpr_auto/w_${width}/`)

    return newUrl
};

const getOrSaveFromLocalStorage = ({ key, value, get }) => {
    console.log("in getOrSaveFromLocalStorage ", key, value, get);

    if (get) {
        const item = localStorage.getItem(key); 
        console.log("Retrieved from localStorage: ", item);

        if (item) {
            try {
                return JSON.parse(item); 
            } catch (error) {
                console.error("Error parsing JSON from localStorage:", error);
                return null;
            }
        }
        return null;
    } else {
        try {
            console.log(" in getOrSaveFromLocalStorage  seting value",value, JSON.stringify(value))
            localStorage.setItem(key, JSON.stringify(value)); 
        } catch (error) {
            console.error("Error saving to localStorage:", error);
        }
    }
};


export {fileFormat , transformImage , getOrSaveFromLocalStorage}