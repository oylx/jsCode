let hash = {}
$('#submit').on('click',(e)=>{
    e.preventDefault();
    let form = $('#signUpForm')
    let need = ['email','password','confirmPassword']
    need.forEach(name=>{
        let value = $('#signUpForm').find(`[name=${name}]`).val()
        hash[name] = value
    })

    if(form.find(`[name ='email']`).val().indexOf('@')===-1){
        alert('no email')
        return
    }else if(form.find(`[name = 'password']`).val()===''){
        alert('no password')
    }else if(form.find(`[name = 'password']`).val()!==form.find(`[name = 'confirmPassword']`).val()){
        
    }

    $.post('/sign_up',hash).then((res)=>{
        console.log(res)
    },(res)=>{
        console.log(res)
    })
})