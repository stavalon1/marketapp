const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dvg7ezenq',
    api_key: '629549942532753',
    api_secret: '4Be0Rglk71C1_-rBNwxH-TdRl5U'
});

router.get('/', (request, response) => {
    response.render('index', {

    });
})

router.post('/uploadfile', async(request, response) => {
    let image = '';
    const files = request.files;
   
    if(files.length > 0){
        files.forEach(async img => {

        const image_name = generateImageName(100000000,999999999);
        const mime = img.mimetype.split('/')[0];
        let body = {
            resource_type: mime,
            public_id: 'myImages/' + image_name
        }
        await cloudinary.v2.uploader.upload(
            img.path, body,
            async function(error, result){
                image = await result.secure_url;
            }
        );
    console.log(image);
});
}
    response.redirect('/');
})

    


function generateImageName(min , max){
    return Math.floor((Math.random() * max) + min);
}

module.exports = router;