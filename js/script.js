let modalKey = 0

let quantPizzas = 1
//carrinho
let cart = [] 
// funçoes auxiliares ou uteis
const seleciona = (elemento) => document.querySelector(elemento);
const selecionaTodos = (elemento) => document.querySelectorAll(elemento);

const formatoReal = (valor) => {
    return valor.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'})
}

const formatoMonetario = (valor) => {
    if(valor) {
        return valor.toFixed(2)
    }
}
const abrirModal = () => {
    seleciona('.pizza-window-area').style.opacity = 0;
    seleciona('.pizza-window-area').style.display = 'flex';
    setTimeout(() => seleciona('.pizza-window-area').style.opacity = 1, 150)
}

const fecharModal = () => {
    seleciona('.pizza-window-area').style.opacity = 0;
    setTimeout(() => seleciona('.pizza-window-area').style.display = 'none', 500)
}

const botoesFechar = () => {
    selecionaTodos('.pizzaInfo-cancelButton, .pizza-info-cancelMobileButton').forEach((item) => 
    item.addEventListener('click', fecharModal)
    )
}

const preencheDadosDasPizzas = (pizzaItem, item, index) => {
    // setar um  atributo para identificar qual elemento foi clicado
    pizzaItem.setAttribute('data-key', index)
    pizzaItem.querySelector('.pizza-item-img img').src = item.img;
    pizzaItem.querySelector('.pizza-item-price').innerHTML = formatoReal(item.price[2])
    pizzaItem.querySelector('.pizza-item-name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item-desc').innerHTML = item.description;
}
const preencheDadosModal = (item) => {

    seleciona('.pizzaInfo h1').innerHTML = item.name;
    seleciona('.pizzaBig img').src = item.img;
    seleciona('.pizzaInfo-desc').innerHTML = item.description;        
    seleciona('.pizzaInfo-actualPrice').innerHTML = formatoReal(item.price[2])
}

const pegarKey = (e) => {
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    console.log('Pizza Clicada ' + key)
    console.log(pizzaJson[key])

    quantPizzas = 1

    modalKey = key

    return key
}
const preencherTamanhos = (key) => {
    // tirar a selecao de tamanho atual e selecionar o tamanho grande
    seleciona('.pizzaInfo-size.selected').classList.remove('selected')
    //selecionar todos os tamanhos
    selecionaTodos('.pizzaInfo-size').forEach((size, sizeIndex) => {
        // selecionar tamanho grande    
        (sizeIndex == 2) ? size.classList.add('selected') : ''
        size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex]
    })
}
const escolherTamanhoPreco = (key) =>{
    // ação nos botoes de tamanho
    //selecionar  todos os tamanhos 
    selecionaTodos('.pizzaInfo-size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (e) => {
            // clicou em um item, tirar a selecao dos outros e marca o q vc clicou
            // tirar  a selecao  de tamanho atual  e selecionar o tamanho grande
            seleciona('.pizzaInfo-size.selected').classList.remove('selected')
            // marcar o que vc clicou, ao inves de usar e.target use size,pois ele é nosso item dentro do loop
            size.classList.add('selected')

            // mudar o preco de acordo com o tamanho
            seleciona('.pizzaInfo-actualPrice').innerHTML = formatoReal(pizzaJson[key].price[sizeIndex])
        })
    })
}
const mudarQuantidade = () => {
    // ações nos botões + e - da janela modal
    seleciona('.pizzaInfo-qtmais').addEventListener('click', () => {
        quantPizzas++
        seleciona('.pizzaInfo-qt').innerHTML = quantPizzas
       
    })
    seleciona('.pizzaInfo-qtmenos').addEventListener('click', () => {
        if(quantPizzas > 1) {
            quantPizzas--
            seleciona('.pizzaInfo-qt').innerHTML = quantPizzas
        }
    })
}
const adicionarNoCarrinho = () => {
    seleciona('.pizzaInfo-addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')
        // pegar dados da janela modal atual
        // qual pizza?pegueo modalKey para usar pizzaJson[modalKey]
        console.log("Pizza" + modalKey)
        //tamanho
        let size = seleciona('.pizzaInfo-size.selected').getAttribute('data-key');
        console.log('Tamanho' + size)
        //quantidade
        console.log('Quant' + quantPizzas)
        //preco
        let price = seleciona('.pizzaInfo-actualPrice').innerHTML.replace('R$&nbsp;', '')
        // cire um identificador que junte id e tamanho
        // concatene as duas informacoes separadas por um simbolo, vc escolhe
        let identificador = pizzaJson[modalKey].id+'t'+size;

        //antes de adicionar verifique se ja tem aquele codigo e tamanho
        // para adicionarmos a quantidade
        let key = cart.findIndex( (item) => item.identificador == identificador)
        console.log(key)

        if(key > -1) {
            // se encontrar aumente a quantidade
            cart[key].qt += quantPizzas
        } else {
            //adicionar objeto pizza no carrinho
            let pizza = {
                identificador,
                id: pizzaJson[modalKey].id,
                size,
                qt: quantPizzas,
                price: parseFloat(price)
            }
            cart.push(pizza);
            console.log(pizza);
            console.log('Sub total R$' + (pizza.qt * pizza.price).toFixed(2))
        }
        fecharModal()
        abrirCarrinho()
        atualizarCarrinho()
    })
}
const abrirCarrinho = () => {
    console.log('Qtd de itens no carrinho' + cart.length)
    if(cart.length > 0) {
        //mostrar carrinho
        seleciona('aside').classList.add('show')
        seleciona('header').style.display = 'flex'
    }
    //exibir aside do carrinho no modo mobile
    seleciona('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0 ) {
            seleciona('aside').classList.add('show')
            seleciona('aside').style.left = '0'
        }
    })
}

    const fecharCarrinho = () => {
        //fechar o carrinho com o botão X no modo mobile
        seleciona('.menu-closer').addEventListener('click', () => {
            seleciona('aside').style.left = '100vw';
            seleciona('header').style.display = 'flex';
        })
    }
    const atualizarCarrinho = () => {
        // exibir numero de itens no carrinho
        seleciona('.menu-openner span').innerHTML = cart.length
        // mostrar ou nao o carrinho
        if(cart.length > 0) {
            //mostra o carrinho 
            seleciona('aside').classList.add('show');
            //zerar meu cart para nao fazer iunsercoes duplicadas
            seleciona('.cart').innerHTML = ''
            // crie as variaveis antes do for
            let subtotal = 0
            let desconto = 0
            let total = 0

            // para preencher os itens do carrinho, calcular subtotal
            for(let i in cart) {
                let pizzaItem = pizzaJson.find( (item) => item.id == cart[i].id)
                console.log(pizzaItem)
                // em cada item pegar o subtotal
                subtotal += cart[i].price * cart[i].qt
                //console.log(cart[i].price)

                //fazer o clone, exibir na telas e depois preencher as informaçoes
                let cartItem = seleciona('.models .cart-item').cloneNode(true)
                seleciona('.cart').append(cartItem)

                
                let pizzaSizeName = cart[i].size
                let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
                // prencher as informaçoes
                cartItem.querySelector('img').src = pizzaItem.img
                cartItem.querySelector('.cart-item-nome').innerHTML = pizzaName
                cartItem.querySelector('.cart-item-qt').innerHTML = cart[i].qt
                // selecionar botoes + e -
                cartItem.querySelector('.cart-item-qtmais').addEventListener('click', () => {
                    console.log('Clicou no botao mais')
                    // adicionar apenas a quantidade que esta neste contexto
                    cart[i].qt++
                    //atualizar carrinho
                    atualizarCarrinho()
                })
                cartItem.querySelector('.cart-item-qtmenos').addEventListener('click', () => {
                    console.log('Clicou no botao menos')
                    if(cart[i].qt > 1) {
                        // subtrair apenas a quantidade que esta neste contexto
                        cart[i].qt--
                    } else {
                        cart.splice(i, 1)
                    }
                    (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''
                    // atualizar carrinho
                    atualizarCarrinho()
                })
                seleciona('.cart').append(cartItem)
            } // fim do for
            desconto = subtotal * 0 
            total = subtotal - desconto

            //exibir na tela os resultados
            //selecionar o ultimo span do elemtno
            seleciona('.subtotal span:last-child').innerHTML = formatoReal(subtotal)
            seleciona('.desconto span:last-child').innerHTML = formatoReal(desconto)
            seleciona('.total span:last-child').innerHTML = formatoReal(total)
        } else {
            // ocultar carrinho
            seleciona('aside').classList.remove('show')
            seleciona('aside').style.left = '100vw'
        }
    }
    const finalizarCompra = () => {
        seleciona('.cart-finalizar').addEventListener('click', () => {
            console.log('Finalizar Compra')
            seleciona('aside').classList.remove('show')
            seleciona('aside').style.left = '100vw'
            seleciona('header').style.display = 'flex'
            seleciona('.checkout').style.display = 'flex'
        })
    }
    const Checkout = () => {
        seleciona('.card-buy').addEventListener('click', () => {
            seleciona('.checkout-img').style.display = 'none'
            seleciona('.move-form').style.display = 'flex'
        })
        seleciona('.pix-buy').addEventListener('click', () => {
            seleciona('.checkout-img').style.display = 'none'
            seleciona('.pix-method').style.display = 'flex'
        })
    }
    const Realizado = () => {
        window.alert('Compra Realizada Com sucesso!')
        window.location.assign('index.html');
    }
pizzaJson.map((item, index) => {
    // console.log(item)

    let pizzaItem = document.querySelector('.models .pizza-item').cloneNode(true);

    // console.log(pizzaItem);

    seleciona('.pizza-area').append(pizzaItem)

    // preencher os dados de cada pizza
    preencheDadosDasPizzas(pizzaItem, item, index)

    // pizza clicada

    pizzaItem.querySelector('.pizza-item a').addEventListener('click', (e) => {
        e.preventDefault()
        //console.log('Clicou na pizza')

    let chave = pegarKey(e)
    // abrir janela modal
       abrirModal()
    // preenchimento dos dados
        preencheDadosModal(item)
    //pegar tamanho clicado
    preencherTamanhos(chave)
    //definir quantidade inicial como 1
    seleciona('.pizzaInfo-qt').innerHTML = quantPizzas
    //selecionar o tamanho e preco com o clique no botao 
    escolherTamanhoPreco(chave)
    })
    botoesFechar()
})

// mudar quantidade com + e - 
mudarQuantidade()

// chamadas 
adicionarNoCarrinho()
atualizarCarrinho()
fecharCarrinho()
finalizarCompra()
Checkout()
