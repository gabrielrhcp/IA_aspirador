
num_Delay = 50;  // VELOCIDADE DA SIMULAÇÃO

var robot1 = new Image(60, 60);
robot1.src = "img/r1.png";
$('#0-0').append(robot1);

var robot2 = new Image(45, 60);
robot2.src = "img/r2.png";
$('#0-19').append(robot2);

robot1_x = 0;
robot1_y = 0;

robot2_x = 0;
robot2_y = 19;

lixeira1_org = 0;
lixeira1_rec = 0;

lixeira2_org = 0;
lixeira2_rec = 0;

lixo_fora = 0;

lixX = new Image(60,60);
lixX.src = 'img/lixeiraX.png';
$('#11-0').append(lixX);

lixY = new Image(60,60);
lixY.src = 'img/lixeiraY.png';
$('#11-19').append(lixY);

char = new Image(60,60);
char.src = 'img/char.png';
$('#19-0').append(char);

rec = new Image(60,60);
rec.src = 'img/rec.jpg';
$('#19-19').append(rec);

var verificacaoLixo = 0;

var perc_rec = [];
var aux_perc_rec = 0
var func_perc_rec = 0
for(var i=0; i<40; i++) {
    perc_rec[i] = 'null';
}


var perc_org = [];
var aux_perc_org = 0
var func_perc_org = 0
for(var i=0; i<40; i++) {
    perc_org[i] = 'null';
}

var imgLixo = new Array(40);
var mundo = new Array(20);
for(var i=0; i<20; i++) {
    mundo[i] = new Array(20);
}
// PREENCHER A MATRIX
for(var i=0; i<20; i++) {
    for(var j=0; j<20; j++) {
        mundo[i][j] = 0;
    }
}

var pos_att, pos_pass;
var max_linha = 3, max_coluna = 11;
var aux1, aux2, aux3;

$(function(){

    sujar();
    
    $('#ars').click(function(){
        esconder();
        $('h3').text('Agente Reativo Simples');
        ars();
    });

    $('#arbm').click(function(){
        esconder();
        $('h3').text('Agente Reativo Baseado em Modelos');
        arbm();
    });

    $('#arbo').click(function(){
        esconder();
        $('h3').text('Agente Reativo Baseado em Objetivos');
        arbo();
    });

    $('#arbu').click(function(){
        esconder();
        $('h3').text('Agente Reativo Baseado na Utilidade');
        arbu();
    });

    $('#voltar').click(function(){
        /*$('h3').fadeOut();
        $('#voltar').fadeOut();
        $('table').fadeOut();
        $('#titulo').fadeIn(1500);
        $('#ars').fadeIn(1500);
        $('#arbm').fadeIn(1500);
        $('#arbo').fadeIn(1500);
        $('#arbu').fadeIn(1500);
        for(var i=0; i<20; i++) {
            for(var j=0; j<20; j++) {
                console.log('x = ' + i + ', y = ' + j + ' => ' + mundo[i][j]);
            }
        }*/
        document.location.reload();
    });
});

function sujar(){
    for(var i=0; i < imgLixo.length ;i++){
        while(true){
            // LIXO RECICLAVEL = 1
            if(getRandomInt(0,100) > 55){
                imgLixo[i] = new Image(30,30);
                imgLixo[i].src = 'img/rec.png';
                aux1 = getRandomInt(0,20);
                aux2 = '#'+aux1+'-';
                aux3 = getRandomInt(0,20);
                aux2 = aux2 + aux3;
                if(mundo[aux1][aux3] != '2' && mundo[aux1][aux3] != '1'){
                    mundo[aux1][aux3] = '1';
                    $(aux2).append(imgLixo[i]);
                    break;
                }   
            // LIXO ORGANICO = 2
            }else{
                
                imgLixo[i] = new Image(30,30);
                imgLixo[i].src = 'img/org.png';
                aux1 = getRandomInt(0,20);
                aux2 = '#'+aux1+'-';
                aux3 = getRandomInt(0,20);
                aux2 = aux2 + aux3;
                if(mundo[aux1][aux3] != '1' && mundo[aux1][aux3] != '2'){
                    mundo[aux1][aux3] = '2';
                    $(aux2).append(imgLixo[i]);
                    break;
                }
            }    
        }
    }
}

function esconder(){
    $('#titulo').fadeOut();
    $('#ars').fadeOut();
    $('#arbm').fadeOut();
    $('#arbo').fadeOut();
    $('#arbu').fadeOut();
    $('h3').fadeIn(1500);
    $('table').fadeIn(1500);
    $('#voltar').fadeIn(2000);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

async function movR2(){
    if(lixeira1_rec != 0){
        await andarAte(robot2_x, robot2_y, 11, 0, 2);
        await andarAte(robot2_x, robot2_y, 19, 19, 2);
        lixeira1_rec--;
    }else if(lixeira2_rec != 0){
        await andarAte(robot2_x, robot2_y, 11, 19, 2);
        await andarAte(robot2_x, robot2_y, 19, 19, 2);
        lixeira2_rec--;
    }else if(lixeira1_org != 0){
        await andarAte(robot2_x, robot2_y, 11, 0, 2);
        await andarAte(robot2_x, robot2_y, 19, 0, 2);
        lixeira1_org--;
    }else if(lixeira2_org != 0){
        await andarAte(robot2_x, robot2_y, 11, 19, 2);
        await andarAte(robot2_x, robot2_y, 19, 0, 2);
        lixeira2_org--;
    }
}

async function ars(){
    for(var i=0; i<20; i++){
        if(i%2 == 0){
            for(var j=0; j<20; j++){
                await andarAte(robot1_x,robot1_y,i,j,1);
                verificacaoLixo = 0;
                while(verificacaoLixo != -1){
                    verificacaoLixo = verifLixo(i,j);     
                    if(verificacaoLixo == 11 || verificacaoLixo == 12){
                        var aux4 = sensorX(i,j);
                        await andarAte(robot1_x,robot1_y, i+aux4,j,1);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(j)){
                            await andarAte(robot1_x, robot1_y ,11 , 0,1);
                            if(lixoRecOrg(i,j)){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAte(robot1_x, robot1_y, 11, 19, 1);
                            if(lixoRecOrg(i,j)){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        await andarAte(robot1_x,robot1_y,i,j,1);  

                    }else if(verificacaoLixo == 21 || verificacaoLixo == 22){
                        var aux5 = sensorY(i,j);
                        await andarAte(robot1_x,robot1_y, i,j+aux5,1);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(j)){
                            await andarAte(robot1_x, robot1_y ,11 , 0,1);
                            if(lixoRecOrg(i,j)){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAte(robot1_x, robot1_y, 11, 19, 1);
                            if(lixoRecOrg(i,j)){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        await andarAte(robot1_x,robot1_y,i,j,1);  

                    }
                }
                
            }       
        }else{
            for(var j=19; j>=0; j--){
                await andarAte(robot1_x,robot1_y,i,j,1);
                verificacaoLixo = 0;
                while(verificacaoLixo != -1){
                    verificacaoLixo = verifLixo(i,j);
                    if(verificacaoLixo == 11 || verificacaoLixo == 12){
                        var aux6 = sensorX(i,j);
                        await andarAte(robot1_x,robot1_y, i+aux6,j,1);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(j)){
                            await andarAte(robot1_x, robot1_y ,11 , 0,1);
                            if(lixoRecOrg(i,j)){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAte(robot1_x, robot1_y, 11, 19, 1);
                            if(lixoRecOrg(i,j)){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        await andarAte(robot1_x,robot1_y,i,j,1);  

                    }else if(verificacaoLixo == 21 || verificacaoLixo == 22){
                        var aux7 = sensorY(i,j);
                        await andarAte(robot1_x,robot1_y, i,j+aux7,1);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(j)){
                            await andarAte(robot1_x, robot1_y ,11 , 0,1);
                            if(lixoRecOrg(i,j)){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAte(robot1_x, robot1_y, 11, 19, 1);
                            if(lixoRecOrg(i,j)){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        await andarAte(robot1_x,robot1_y,i,j,1);  
                    }  
                }  
            }
        }
    }
}

async function arbm(){
    for(var i=0; i<20; i++){
        if(i%2 == 0){
            for(var j=0; j<20; j++){
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                while(perc_rec[func_perc_rec] != 'null' || perc_org[func_perc_org] != 'null'){
                    while(perc_rec[func_perc_rec] != 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_rec[func_perc_rec]),valorPercY(perc_rec[func_perc_rec]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_rec++;
                    }
                    while(perc_org[func_perc_org] != 'null' && perc_rec[func_perc_rec] == 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_org[func_perc_org]),valorPercY(perc_org[func_perc_org]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_org++;
                    }
                }     
                await andarAteARBM(robot1_x,robot1_y,i,j,1); 
            }

        }else{
            for(var j=19; j>=0; j--){
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                while(perc_rec[func_perc_rec] != 'null' || perc_org[func_perc_org] != 'null'){
                    while(perc_rec[func_perc_rec] != 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_rec[func_perc_rec]),valorPercY(perc_rec[func_perc_rec]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_rec++;
                    }
                    while(perc_org[func_perc_org] != 'null' && perc_rec[func_perc_rec] == 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_org[func_perc_org]),valorPercY(perc_org[func_perc_org]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_org++;
                    }
                }   
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                
            }  
        }
    }

    console.log('lixo total = ' + aux_perc_org+' + '+aux_perc_rec);
}

async function arbo(){
    for(var i=0; i<20; i++){
        if(i%2 == 0){
            for(var j=0; j<20; j++){
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                while(perc_rec[func_perc_rec] != 'null' || perc_org[func_perc_org] != 'null'){
                    while(perc_rec[func_perc_rec] != 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_rec[func_perc_rec]),valorPercY(perc_rec[func_perc_rec]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_rec++;
                    }
                    while(perc_org[func_perc_org] != 'null' && perc_rec[func_perc_rec] == 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_org[func_perc_org]),valorPercY(perc_org[func_perc_org]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_org++;
                    }
                }     
                await andarAteARBM(robot1_x,robot1_y,i,j,1); 
            }

        }else{
            for(var j=19; j>=0; j--){
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                while(perc_rec[func_perc_rec] != 'null' || perc_org[func_perc_org] != 'null'){
                    while(perc_rec[func_perc_rec] != 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_rec[func_perc_rec]),valorPercY(perc_rec[func_perc_rec]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_rec++;
                    }
                    while(perc_org[func_perc_org] != 'null' && perc_rec[func_perc_rec] == 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_org[func_perc_org]),valorPercY(perc_org[func_perc_org]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_org++;
                    }
                }   
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                
            }  
        }
    }
}

async function arbu(){
    for(var i=0; i<20; i++){
        if(i%2 == 0){
            for(var j=0; j<20; j++){
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                while(perc_rec[func_perc_rec] != 'null' || perc_org[func_perc_org] != 'null'){
                    while(perc_rec[func_perc_rec] != 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_rec[func_perc_rec]),valorPercY(perc_rec[func_perc_rec]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_rec++;
                    }
                    while(perc_org[func_perc_org] != 'null' && perc_rec[func_perc_rec] == 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_org[func_perc_org]),valorPercY(perc_org[func_perc_org]),1);
                        if(perc_rec[func_perc_rec] != 'null'){
                            break;
                        }
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_org++;
                    }
                }     
                await andarAteARBM(robot1_x,robot1_y,i,j,1); 
            }

        }else{
            for(var j=19; j>=0; j--){
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                while(perc_rec[func_perc_rec] != 'null' || perc_org[func_perc_org] != 'null'){
                    while(perc_rec[func_perc_rec] != 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_rec[func_perc_rec]),valorPercY(perc_rec[func_perc_rec]),1);
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_rec++;
                    }
                    while(perc_org[func_perc_org] != 'null' && perc_rec[func_perc_rec] == 'null'){
                        await andarAteARBM(robot1_x,robot1_y,valorPercX(perc_org[func_perc_org]),valorPercY(perc_org[func_perc_org]),1);
                        if(perc_rec[func_perc_rec] != 'null'){
                            break;
                        }
                        typeLixo = lixoRecOrg(robot1_x,robot1_y);
                        removeLixo(robot1_x,robot1_y);
                        if(lixeiraProx(robot1_y)){
                            await andarAteARBM(robot1_x, robot1_y ,11 , 0,1);
                            if(typeLixo){
                                lixeira1_rec++;
                            }else{
                                lixeira1_org++;
                            }
                        }else{
                            await andarAteARBM(robot1_x, robot1_y, 11, 19, 1);
                            if(typeLixo){
                                lixeira2_rec++;
                            }else{
                                lixeira2_org++;
                            }
                        }
                        await movR2();
                        func_perc_org++;
                    }
                }   
                await andarAteARBM(robot1_x,robot1_y,i,j,1);
                
            }  
        }
    }
}

function valorPercX(x){
    if(x.substr(3,1) == '-'){
        return x.substr(1,2);
    }
    return x.substr(1,1);
}

function valorPercY(y){
    if(y.substr(3,1) == '-'){
        return y.substr(4,2);
    }
    return y.substr(3,2);
}

function andar(x, y, r){
    if(r == 1){
        $('#'+x+'-'+y).append(robot1);
    }else{
        $('#'+x+'-'+y).append(robot2);
    }
}

function verifLixo(x,y){
    for(var i=0; i < 5; i++){
        if(x+i < 20 && mundo[x+i][y] == '1'){
            return 11; // lixo rec no X
        }else if(y+i < 20 && mundo[x][y+i] == '1'){
            return 21; // lixo rec no Y
        }
    }
    for(var i=0; i < 5; i++){
        if(x+i < 20 && mundo[x+i][y] == '2'){
            return 12; // lixo org no X
        }else if(y+i < 20 && mundo[x][y+i] == '2'){
            return 22; // lixo org no Y
        }
    }
    return -1;
}

function sensorX(x,y){
    for(var i=0; i < 5; i++){
        if(x+i < 20 && mundo[x+i][y] == '1'){
            return i;
        }
    }
    for(var i=0; i < 5; i++){
        if(x+i < 20 && mundo[x+i][y] == '2'){
            return i;
        }
    }
}

function sensorY(x,y){
    for(var i=0; i < 5; i++){
        if(y+i < 20 && mundo[x][y+i] == '1'){
            return i;
        }
    }
    for(var i=0; i < 5; i++){
        if(y+i < 20 && mundo[x][y+i] == '2'){
            return i;
        }
    }
}

function salvarPercMundo(x,y){
    for(var i=0; i < 5; i++){
        if(x+i < 20 && mundo[x+i][y] == '1'){
            perc_rec[aux_perc_rec] = '#'+ (x+i) + '-' + y;
            for(var j=0; j<aux_perc_rec; j++){
                if(perc_rec[j] == perc_rec[aux_perc_rec]){
                    perc_rec[aux_perc_rec] = 'null';
                    aux_perc_rec--;
                    break;
                }
            }
            aux_perc_rec++;
        }
        if(y+i < 20 && mundo[x][y+i] == '1'){
            perc_rec[aux_perc_rec] = '#'+ x + '-' + (y+i);
            for(var j=0; j<aux_perc_rec; j++){
                if(perc_rec[j] == perc_rec[aux_perc_rec]){
                    perc_rec[aux_perc_rec] = 'null';
                    aux_perc_rec--;
                    break;
                }
            }
            aux_perc_rec++;
        }

        if(x-i >= 0 && mundo[x-i][y] == '1'){
            perc_rec[aux_perc_rec] = '#'+ (x-i) + '-' + y;
            for(var j=0; j<aux_perc_rec; j++){
                if(perc_rec[j] == perc_rec[aux_perc_rec]){
                    perc_rec[aux_perc_rec] = 'null';
                    aux_perc_rec--;
                    break;
                }
            }
            aux_perc_rec++;
        }
        if(y-i >= 0 && mundo[x][y-i] == '1'){
            perc_rec[aux_perc_rec] = '#'+ x + '-' + (y-i);
            for(var j=0; j<aux_perc_rec; j++){
                if(perc_rec[j] == perc_rec[aux_perc_rec]){
                    perc_rec[aux_perc_rec] = 'null';
                    aux_perc_rec--;
                    break;
                }
            }
            aux_perc_rec++;
        }
    }
    
    for(var i=0; i < 5; i++){
        if(x+i < 20 && mundo[x+i][y] == '2'){
            perc_org[aux_perc_org] = '#'+ (x+i) + '-' + y;
            for(var j=0; j<aux_perc_org; j++){
                if(perc_org[j] == perc_org[aux_perc_org]){
                    perc_org[aux_perc_org] = 'null';
                    aux_perc_org--;
                    break;
                }
            }
            aux_perc_org++;
        }
        if(y+i < 20 && mundo[x][y+i] == '2'){
            perc_org[aux_perc_org] = '#'+ x + '-' + (y+i);
            for(var j=0; j<aux_perc_org; j++){
                if(perc_org[j] == perc_org[aux_perc_org]){
                    perc_org[aux_perc_org] = 'null';
                    aux_perc_org--;
                    break;
                }
            }
            aux_perc_org++;
        }

        if(x-i >= 0 && mundo[x-i][y] == '2'){
            perc_org[aux_perc_org] = '#'+ (x-i) + '-' + y;
            for(var j=0; j<aux_perc_org; j++){
                if(perc_org[j] == perc_org[aux_perc_org]){
                    perc_org[aux_perc_org] = 'null';
                    aux_perc_org--;
                    break;
                }
            }
            aux_perc_org++;
        }
        if(y-i >= 0 && mundo[x][y-i] == '2'){
            perc_org[aux_perc_org] = '#'+ x + '-' + (y-i);
            for(var j=0; j<aux_perc_org; j++){
                if(perc_org[j] == perc_org[aux_perc_org]){
                    perc_org[aux_perc_org] = 'null';
                    aux_perc_org--;
                    break;
                }
            }
            aux_perc_org++;
        }
    }
}

function lixoRecOrg(x, y){
    if(mundo[x][y] == '1'){
        return true; // LIXO RECICLAVEL
    }else{
        return false; // LIXO ORGANICO
    }
}

async function andarAte(ox, oy, x, y,r){
    if(x >= ox){
        if(y >= oy){
            for(var i=ox; i<=x; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
            }
            for(var i=oy; i<=y; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
            }          
        }else{
            for(var i=ox; i<=x; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
            }
            for(var i=oy; i>=y; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
            }  
        }
    }else{
        if(y >= oy){
            for(var i=ox; i>=x; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r)
            }
            for(var i=oy; i<=y; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
            }          
        }else{
            for(var i=ox; i>=x; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
            }
            for(var i=oy; i>=y; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
            }  
        }
    }

    if( r == 1){
        robot1_x = x;
        robot1_y = y;
    }else{
        robot2_x = x;
        robot2_y = y;
    }
}

async function andarAteARBM(ox, oy, x, y,r){
    if(x >= ox){
        if(y >= oy){
            for(var i=ox; i<=x; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
                salvarPercMundo(parseInt(i),parseInt(oy));
            }
            for(var i=oy; i<=y; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
                salvarPercMundo(parseInt(x),parseInt(i));
            }          
        }else{
            for(var i=ox; i<=x; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
                salvarPercMundo(parseInt(i),parseInt(oy));
            }
            for(var i=oy; i>=y; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
                salvarPercMundo(parseInt(x),parseInt(i));
            }  
        }
    }else{
        if(y >= oy){
            for(var i=ox; i>=x; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
                salvarPercMundo(parseInt(i),parseInt(oy));
            }
            for(var i=oy; i<=y; i++){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
                salvarPercMundo(parseInt(x),parseInt(i));
            }          
        }else{
            for(var i=ox; i>=x; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(i,oy,r);
                salvarPercMundo(parseInt(i),parseInt(oy));
            }
            for(var i=oy; i>=y; i--){
                await new Promise(r => setTimeout(r, num_Delay));
                andar(x,i,r);
                salvarPercMundo(parseInt(x),parseInt(i));
            }  
        }
    }

    if( r == 1){
        robot1_x = x;
        robot1_y = y;
    }else{
        robot2_x = x;
        robot2_y = y;
    }
}

/*async function organizarVetor(){
    var auxvet = [];
    for(var i=func_perc_rec-1;i<aux_perc_rec;i++){
        auxvet[i]= Math.sqrt(((valorPercX(perc_rec[i])-robot1_x)*(valorPercX(perc_rec[i])-robot1_x))+((valorPercY(perc_rec[i])-robot1_y)*(valorPercY(perc_rec[i])-robot1_y)))
    }
    console.log(perc_rec)
    console.log(auxvet)
    auxvet.sort(function(a, b){return a-b;});
    console.log(auxvet)
}*/

function lixeiraProx(y){
    if(y <= 10){
        return true; //lixeira1
    }else{
        return false; //lixeira 2
    }
}

function removeLixo(x,y){
    mundo[x][y] = 0;
    $('#'+x+'-'+y).empty();
    $('#'+x+'-'+y).append(robot1);
    if(x == 11){
        if(y == 0){
            $('#11-0').append(lixX);
        }else if(y == 19){
            $('#11-19').append(lixY);
        }
    }else if(x == 19){
        if(y == 0){
            $('#19-0').append(char);
        }else if(y == 19){
            $('#19-19').append(rec);
        }
    }
    lixo_fora++;
}


