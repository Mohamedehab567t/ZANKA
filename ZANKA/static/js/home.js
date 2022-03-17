localStorage.clear()
$('.menueBar').on('click' , function(){
    let item = localStorage.getItem("menuebar")
    if(item != undefined){
        if($(this).data('menue') != item ){
            showMenue(this)
        }else{
            hideMenue(this)
        }
    }else{
        showMenue(this)
    }

})


$('.menueItem').on('click' , function(){
    let form = $('#'+$(this).data('form'))
    let backdrop = Array.from($('.backdrop'))[0]
    let backdropForm = $(backdrop).find('.form')[0]
    $(backdropForm).html($(form).html())
    $(backdrop).attr('style' , 'display:flex !important;')
    hideGenralMenue()
})

$('.main_item').on('click' , function(){
    let table = $('#'+$(this).data('table'))
    let backdrop = Array.from($('.backdrop'))[0]
    let backdropForm = $(backdrop).find('.form')[0]
    $(backdropForm).html($(table).html())
    $(backdrop).attr('style' , 'display:flex !important;')
})

$(window).on('change' , function(e){
    if ($(e.target).attr('id') == 'recipt_zanka_sa7abat_count' || $(e.target).attr('id') == 'recipt_zanka_size' ){
        let size = $('body').find('#recipt_zanka_size')
        if($(size).val() == '' || $(size).val() == NaN){
            alert('ادخل المقاس اولا')
            $(e.target).val(0)
        }else{
            let far5 = $('body').find('#recipt_zanka_far5_count')
            let valr = parseFloat($("#recipt_zanka_sa7abat_count").val()) / parseFloat($("#recipt_zanka_size").val())
            if(valr == NaN){
                $(far5).val(0)
            }else{
                $(far5).val(valr.toFixed(0))
            }
        }
    }
})

$(window).on('click' , function(e){
    if($(e.target).attr('class') == undefined){
        hideGenralMenue()
    }if($(e.target).hasClass('backdrop')){
        $('.tochange').prop('disabled' , true)
    }
    if($(e.target).hasClass('closeBackdrop')){
        $('.backdrop').attr('style' , 'display:none !important;')
        window.location.reload()
    }
    if($(e.target).hasClass('addinfos')){
        let add = e.target
        let form = $('.backdrop').find('.form')
        let dataset = Array.from($(form).find('input'))
        let selects = Array.from($(form).find('select'))
        selects.map(e => ( dataset = [...dataset , e]))
        let dict = {}
        dataset.forEach(e => {
            if($(e).val() == ''){
                alert($(e).attr('placeholder') + " فارغ")
            }else{
                dict[$(e).attr('id')] = $(e).val()
            }
        })
        if(Object.keys(dict).length == dataset.length){
            dict['type'] = $(add).data('form_id')
            $.ajax({
                type: 'POST',
               url: '/api/addData',
                data: JSON.stringify(dict),
                contentType: 'application/json;charset=UTF-8',
                success : function(data){
                    alert(data)
                },
                error : function(errmsg) {
                    alert(errmsg.statusText)
                }
                });
        }
    }else if ($(e.target).hasClass('serach')){
        let search = e.target
        let form = $('.backdrop').find('.form')
        let dataset = Array.from($(form).find('input'))
        let selects = Array.from($(form).find('select'))
        selects.map(e => ( dataset = [...dataset , e]))
        let dict = {}
        dataset.forEach(e => {
            if($(e).val() != ''){
                dict[$(e).attr('id')] = $(e).val()
            }
        })
        if(dict["dateOfRecivieS1"] && dict['dateOfRecivieS2'] && dict['dateOfRecivieS3'] && dict["dateOfRecivieE1"] && dict['dateOfRecivieE2'] && dict['dateOfRecivieE3']){
            dict["dateOfRecivieS"] = dict["dateOfRecivieS2"]+"-"+dict['dateOfRecivieS1']+"-"+dict['dateOfRecivieS3']
            dict["dateOfRecivieE"] = dict["dateOfRecivieE2"]+"-"+dict['dateOfRecivieE1']+"-"+dict['dateOfRecivieE3']    
        }        
        delete dict["dateOfRecivieS1"]
        delete dict['dateOfRecivieS2']
        delete dict['dateOfRecivieS3']
        delete dict["dateOfRecivieE1"]
        delete dict["dateOfRecivieE2"]
        delete dict["dateOfRecivieE3"]

        $.ajax({
            type: 'POST',
                url: '/api/searchData',
                 data: JSON.stringify(dict),
                 contentType: 'application/json;charset=UTF-8',
                 success : function(data){
                    var newWin = open("status=1,scrollbars=yes,resizable=yes,top=500,left=500");
                    newWin.moveTo(0, 0);
                    newWin.resizeTo(screen.width, screen.height);
                    newWin.document.write(data);
                },
                 error : function(errmsg) {
                    alert(errmsg.statusText)
               }
              });
    }else if ($(e.target).hasClass('serach_by_date')){
        let form = $('.backdrop').find('.form')
        let dataset = Array.from($(form).find('input'))
        let selects = Array.from($(form).find('select'))
        selects.map(e => ( dataset = [...dataset , e]))
        let dict = {}
        dataset.forEach(e => {
            if($(e).val() == ''){
                alert($(e).attr('placeholder') + " فارغ")
            }else{
                dict[$(e).data('id')] = $(e).val()
            }
        })
        
        if(Object.keys(dict).length == dataset.length){
            $.ajax({
                type: 'POST',
                    url: '/api/searchByDate',
                     data: JSON.stringify(dict),
                     contentType: 'application/json;charset=UTF-8',
                     success : function(data){
                        var newWin = open('تقرير محدد','_blank',"toolbar=yes,scrollbars=yes,resizable=yes,top=500,left=500");
                        newWin.document.write(data);
                    },
                     error : function(errmsg) {
                        alert(errmsg.statusText)
                   }
                  });
        }

    }else if ($(e.target).hasClass('updateRow')){
        let inputs = Array.from($("#updateRowForm").find('.input'))
        console.log(inputs)
        let dict = {}
        inputs.forEach(e => {
            dict[$(e).attr("id")] = $(e).val()
            console.log($(e).attr("id"))
        })
        dict['type'] = $(e.target).data("type")
        dict['id'] = $(e.target).data("id")
        dict["recipt_data"] = dict["recipt_data3"]+"-"+dict['recipt_data2']+"-"+dict['recipt_data1']
        console.log(dict)
        $.ajax({
            type: 'POST',
            url: '/api/updateData',
            data: JSON.stringify(dict),
            contentType: 'application/json;charset=UTF-8',
            success : function(data){
                window.close()
            },
            error : function(errmsg) {
                alert(errmsg.statusText)
            }
            });
    }
    if($(e.target).hasClass('update')){
        let inputs = Array.from($(e.target).closest('td').siblings().find('input'))
        let tr = $(e.target).closest('td').parents('tr')
        let dict = {}
        inputs.forEach(e => {
            dict[$(e).data("key")] = $(e).val()
        })
        dict['type'] = $(e.target).data("type")
        dict['id'] = $(e.target).data("id")
        $.ajax({
            type: 'POST',
            url: '/api/updateData',
            data: JSON.stringify(dict),
            contentType: 'application/json;charset=UTF-8',
            success : function(data){
                alert(data)
                $(tr).attr('style' , 'background-color:green;color:white;')
            },
            error : function(errmsg) {
                alert(errmsg.statusText)
            }
            });
    }else if ($(e.target).hasClass('delete')){
        let tr = $(e.target).closest('td').parents('tr')
        $.ajax({
            type: 'DELETE',
            url: '/api/deleteData',
            data: JSON.stringify({'id' : $(e.target).data("id") , 'type' : $(e.target).data("type")}),
            contentType: 'application/json;charset=UTF-8',
            success : function(data){
                alert(data)
                $(tr).attr('style' , 'background-color:red;color:white;')
            },
            error : function(errmsg) {
                alert(errmsg.statusText)
            }
            });
    }else if ($(e.target).hasClass("modup")){
        let recipt = JSON.parse(localStorage.getItem('recipt'))
        $("#MOD").data("index" , $(e.target).data("index"))
        rewriteData(recipt["rows"][parseInt($(e.target).data("index"))])

    }else if ($(e.target).hasClass("min")){
        let recipt = JSON.parse(localStorage.getItem('recipt'))
        recipt['rows'].splice(parseInt($(e.target).data("index")) , 1)
        localStorage.setItem('recipt' , JSON.stringify(recipt))
        createRow(JSON.parse(localStorage.getItem('recipt')))
    }

    if($(e.target).hasClass("recipt_control")){
        let func = $(e.target).data("func")
        switch(func){
            case 'right' :
                rightControlFunction()
                break;
            case 'add' : 
                addControlFunction()
                break;
            case 'left' :
                leftControlFunction()
                break;
            case 'local' :
                localControlFunction()
                break;
            case 'modify' :
                modifyControl()
        }
    }
})
$(".await_tr").on("click" , function(){
    
})
$(window).on('dblclick' , function(e){
    if($(e.target).hasClass('toChange')){
        $(e.target).prop('disabled' , false)
    }
})

function hideGenralMenue(){
    $('.menue').hide()
    localStorage.removeItem("menuebar")
}

function showMenue(th){
    let div = $('#'+$(th).data('menue'))
    let value = th.offsetHeight + 15
    $(div).attr('style' , `display:block; top:${value}px !important`)
    $(div).siblings().attr('style' , `display:none; top:${value}px !important`)
    localStorage.setItem("menuebar" , $(th).data('menue'))
}

function hideMenue(th){
    let div = $('#'+$(th).data('menue'))
    $(div).attr('style' , `display:none;`)
    localStorage.removeItem("menuebar")
}
function rightControlFunction(){
    let recipt = JSON.parse(localStorage.getItem('recipt'))
    if(recipt == undefined){
        alert('لا يوجد فاتورة بعد')
    }else{
        let index = recipt['index']
        let rows = recipt['rows']
        if(index != 0){
            recipt['index'] = recipt['index'] - 1
            localStorage.setItem('recipt' , JSON.stringify(recipt))
            let obj = rows[recipt['index']]
            $("#length").text(recipt['rows'].length)
            $("#index").text(recipt['index'] + 1) 
            rewriteData(obj)
        }else{
            alert("لا يوجد زنكات بعد")
        }

    }
}

function addControlFunction(){
    let form = $('.backdrop').find('.form')
    let dataset = Array.from($(form).find('input'))
    let selects = Array.from($(form).find('select'))
    selects.map(e => ( dataset = [...dataset , e]))
    let dict = {}
    console.log(dataset)
    dataset.forEach(e => {
        if($(e).val() == ''){
            alert($(e).attr('placeholder') + " فارغ")
        }else{
            dict[$(e).attr('id')] = $(e).val()
        }
    })
    dict["recipt_data"] = dict["recipt_data1"]+"-"+dict['recipt_data2']+"-"+dict['recipt_data3']
    if(Object.keys(dict).length == dataset.length + 1){
        let recipt = JSON.parse(localStorage.getItem('recipt'))
        if(recipt == undefined){
            let reciptOBJ = {}
            let rows = []
            rows.push(dict)
            reciptOBJ['rows'] = rows
            reciptOBJ['index'] = 0
            $("#length").text(1)
            $("#index").text(1)
            localStorage.setItem('recipt' , JSON.stringify(reciptOBJ))
            let recipt = JSON.parse(localStorage.getItem('recipt'))
            createRow(recipt)
            EmptyData()
            alert('تم الاضافة')
        }else{
            if(recipt['index'] < (recipt['rows'].length) - 1){
                /*let recipt = JSON.parse(localStorage.getItem('recipt'))
                let rows = recipt['rows']
                rows[recipt['index']] = dict
                localStorage.setItem('recipt' , JSON.stringify(recipt))
                $("#length").text(recipt['rows'].length)
                $("#index").text(recipt['index'] + 1)
                createRow(recipt)
                alert('تم التعديل')*/
            }else{
                let recipt = JSON.parse(localStorage.getItem('recipt'))
                let rows = recipt['rows']
                recipt['index'] = recipt['index'] + 1
                rows.push(dict)
                localStorage.setItem('recipt' , JSON.stringify(recipt))
                $("#length").text(recipt['rows'].length)
                $("#index").text(recipt['index'] + 1)
                createRow(recipt)
                EmptyData()
                alert('تم الاضافة')
            }
        }

    }
}

function modifyControl(){
    let index = $("#MOD").data("index")
    if(parseInt(index) != -1){
    let form = $('.backdrop').find('.form')
    let dataset = Array.from($(form).find('input'))
    let selects = Array.from($(form).find('select'))
    selects.map(e => ( dataset = [...dataset , e]))
    let dict = {}
    dataset.forEach(e => {
        if($(e).val() == ''){
            alert($(e).attr('placeholder') + " فارغ")
        }else{
            dict[$(e).attr('id')] = $(e).val()
        }
    })
    dict["recipt_data"] = dict["recipt_data1"]+"-"+dict['recipt_data2']+"-"+dict['recipt_data3']
    let recipt = JSON.parse(localStorage.getItem('recipt'))
        let rows = recipt['rows']
        rows[index] = dict
        localStorage.setItem('recipt' , JSON.stringify(recipt))
        createRow(recipt)
        $("#MOD").data("index" , "-1")
        EmptyData()
        alert('تم التعديل')
    }else{
        alert('الرجاء اختيار زنكة لتعديلها')
    }
}

function leftControlFunction(){
    let recipt = JSON.parse(localStorage.getItem('recipt'))
    if(recipt == undefined){
        alert('لا يوجد فاتورة بعد')
    }else{
        let index = recipt['index']
        let rows = recipt['rows']
        if(index != (rows.length - 1)){
            recipt['index'] = recipt['index'] + 1
            localStorage.setItem('recipt' , JSON.stringify(recipt))
            let obj = rows[recipt['index']]
            $("#length").text(recipt['rows'].length)
            $("#index").text(recipt['index'] + 1) 
            rewriteData(obj)
        }else{
            alert("لا يوجد زنكات بعد")
        }
    }
}
function rewriteData(obj){
    let form = $('.backdrop').find('.form')
    let dataset = Array.from($(form).find('input'))
    let selects = Array.from($(form).find('select'))
    selects.map(e => ( dataset = [...dataset , e]))
    dataset.forEach(e => {
        $(e).val(obj[$(e).attr('id')])
    })
}
function EmptyData(){
    let form = $('.backdrop').find('.form')
    let dataset = Array.from($(form).find('input'))
    let selects = Array.from($(form).find('select'))
    selects.map(e => ( dataset = [...dataset , e]))
    dataset.forEach(e => {
        if($(e).attr("id") != "recipt_number"){
            if($(e).attr("id") == "recipt_service_name" || $(e).attr("id") == "recipt_service_ctp" ||  $(e).attr("id") == "recipt_notes"){
                $(e).val("-")
            }else{
                $(e).val("")
            }
        }
    })
}
function localControlFunction(){
        let recipt = JSON.parse(localStorage.getItem('recipt'))
        if(recipt == undefined){
            alert('لا يوجد فاتورة لاضافتها')
        }else{   
            let rows = recipt['rows']         
            rows.forEach( e => {
                e['type'] = 'recipt'
                $.ajax({
                    type: 'POST',
                   url: '/api/addData',
                    data: JSON.stringify(e),
                    contentType: 'application/json;charset=UTF-8',
                    beforeSend : function(){
                        $('.loading').attr('style' , 'display:flex')
                        $('#msgToWait').text("جاري اضافة الزنكه رقم " +rows.indexOf(e))
                    },
                    success : function(){
                        window.location.reload()
                    },
                    error : function(errmsg) {
                        alert(errmsg.statusText)
                    }
                    });
            })
            
        }
}


    //createProductRow
function createRow(obj){
        let tablebody = $("#Awaittable").find("tbody")[0]
        $(tablebody).empty()
        obj['rows'].forEach(e => {
            let tr = document.createElement('tr')
            let recipt_ctp = document.createElement('td')
            let recipt_data = document.createElement('td')
            let recipt_notes = document.createElement('td')
            let recipt_number = document.createElement('td')
            let recipt_paper_type = document.createElement('td')
            let recipt_printers = document.createElement('td')
            let recipt_service_ctp = document.createElement('td')
            let recipt_service_name = document.createElement('td')
            let recipt_zanka_color_count = document.createElement('td')
            let recipt_zanka_far5_count = document.createElement('td')
            let recipt_zanka_name = document.createElement('td')
            let recipt_zanka_sa7abat_count = document.createElement('td')
            let recipt_zanka_size = document.createElement('td')
            let nothing = document.createElement('td')
            let deleteElement = document.createElement('td')
            let updateElement = document.createElement('td')

            $(recipt_ctp).text(e['recipt_ctp'])
            $(recipt_data).text(e['recipt_data'])
            $(recipt_notes).text(e['recipt_notes'])
            $(recipt_number).text(e['recipt_number'])
            $(recipt_paper_type).text(e['recipt_paper_type'])
            $(recipt_printers).text(e['recipt_printers'])
            $(recipt_service_ctp).text(e['recipt_service_ctp'])
            $(recipt_service_name).text(e['recipt_service_name'])
            $(recipt_zanka_color_count).text(e['recipt_zanka_color_count'])
            $(recipt_zanka_far5_count).text(e['recipt_zanka_far5_count'])
            $(recipt_zanka_name).text(e['recipt_zanka_name'])
            $(recipt_zanka_sa7abat_count).text(e['recipt_zanka_sa7abat_count'])
            $(recipt_zanka_size).text(e['recipt_zanka_size'])
            $(nothing).text("")

            $(deleteElement).append(`<i class="fa fa-minus-circle min" data-index=${obj['rows'].indexOf(e)} style="color : red;"></i>`)
            $(updateElement).append(`<i class="fa fa-pencil modup" data-index=${obj['rows'].indexOf(e)} style="color : light blue;"></i>`)
            $(tr).append(recipt_data)
            $(tr).append(recipt_number)
            $(tr).append(recipt_zanka_name)
            $(tr).append(recipt_ctp)
            $(tr).append(recipt_zanka_color_count)
            $(tr).append(recipt_printers)
            $(tr).append(recipt_paper_type)
            $(tr).append(recipt_zanka_size)
            $(tr).append(recipt_zanka_sa7abat_count)
            $(tr).append(recipt_zanka_far5_count)
            $(tr).append(recipt_service_name)
            $(tr).append(recipt_service_ctp)
            $(tr).append(nothing)
            $(tr).append(recipt_notes)
            $(tr).append(deleteElement)
            $(tr).append(updateElement)
            $(tr).addClass("await_tr")
            $(tablebody).append(tr)
        })
    }