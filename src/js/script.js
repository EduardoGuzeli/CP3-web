
const produtos = [
  {
    id: 1,
    nome: "BMW S1000RR",
    descricao: "Superbike alemã de 210cv, motor inline-4 de 999cc, eletrônica de competição com tração e wheelie control. Referência em performance nas pistas.",
    preco: 149900,
    imagem: "/src/assets/img/BMWS1000RR.png",
  },
  {
    id: 2,
    nome: "Yamaha R6",
    descricao: "Esportiva pura de 599cc com 122cv, chassi Deltabox e suspensão KYB totalmente ajustável. DNA de MotoGP para as ruas e circuitos.",
    preco: 89900,
    imagem: "/src/assets/img/YamahaR6.png",
  },
  {
    id: 3,
    nome: "Honda Hornet",
    descricao: "Naked esportiva com motor de 600cc e 102cv. Ágil, versátil e com estilo inconfundível. A queridinha das ruas brasileiras.",
    preco: 54900,
    imagem: "/src/assets/img/HondaHornet.png",
  },
  {
    id: 4,
    nome: "Honda CB 500F",
    descricao: "Motor paralelo twin de 471cc, 47cv e baixo consumo. Ideal para iniciantes e intermediários que buscam equilíbrio entre desempenho e custo.",
    preco: 38900,
    imagem: "/src/assets/img/HondaCB500F.png",
  },
  {
    id: 5,
    nome: "Kawasaki H2R",
    descricao: "A moto de produção mais rápida do mundo. Supercharger de 310cv, carbono e titânio por toda a estrutura. Apenas para pistas — pura insanidade japonesa.",
    preco: 320000,
    imagem: "/src/assets/img/KawasakiH2R.png"
  },
  {
    id: 6,
    nome: "BMW R 1250 GS",
    descricao: "A rainha do adventure touring. Motor Boxer de 1254cc e 136cv, ShiftCam technology, suspensão Telelever e mais de 50 anos de história off-road.",
    preco: 134900,
    imagem: "/src/assets/img/BMWR1250GS.png"
  }
];
 
function formatarPreco(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
 
function renderizarCards() {
  const container = document.getElementById('cards-container');
  if (!container) return;
 
  container.innerHTML = '';
 
  produtos.forEach(produto => {
    const card = document.createElement('div');
    card.classList.add('card');
 
    card.innerHTML = `
      <img class="card-img" src="${produto.imagem}" alt="${produto.nome}">
      <div class="card-body">
        <h3 class="card-nome">${produto.nome}</h3>
        <p class="card-desc">${produto.descricao}</p>
        <span class="card-preco">${formatarPreco(produto.preco)}</span>
        <button class="btn-add" onclick="adicionarAoCarrinho(${produto.id}, this)">Adicionar ao Carrinho</button>
      </div>
    `;                                          
 
    container.appendChild(card);
  });
}
 
// ← APAGA A LINHA ANTIGA E DEIXA SÓ ESSA:
document.addEventListener('DOMContentLoaded', () => {
  renderizarCards();
  renderizarCarrinho();
});
 
// ===== CARRINHO =====
 
function lerCarrinho() {
  const salvo = localStorage.getItem('carrinho');
  return salvo ? JSON.parse(salvo) : [];
}
 
function salvarCarrinho(carrinho) {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));
}
 
function adicionarAoCarrinho(id, btn) {
  const produto = produtos.find(p => p.id === id);
  if (!produto) return;
 
  const carrinho = lerCarrinho();
  const itemExistente = carrinho.find(item => item.id === id);
 
  if (itemExistente) {
    itemExistente.quantidade += 1;
  } else {
    carrinho.push({ id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 });
  }
 
  salvarCarrinho(carrinho);
 
  btn.textContent = '✓ Adicionado!';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Adicionar ao Carrinho';
    btn.disabled = false;
  }, 1500);
}
 
function calcularTotal(itens) {
  return itens.reduce((acumulador, item) => {
    return acumulador + (item.preco * item.quantidade);
  }, 0);
}
 
function renderizarCarrinho() {
  const lista = document.getElementById('carrinho-lista');
  if (!lista) return;
 
  const carrinho = lerCarrinho();
  lista.innerHTML = '';
 
  if (carrinho.length === 0) {
    lista.innerHTML = '<li style="text-align:center; color:#888; padding:2rem;">Carrinho vazio. Adicione motos na página inicial!</li>';
    document.getElementById('total-compra').textContent = formatarPreco(0);
    return;
  }
 
carrinho.forEach((item, index) => {
    const li = document.createElement('li');
    li.classList.add('carrinho-item');
 
    li.innerHTML = `
  <div class="item-info">
    <span class="item-nome">${item.nome}</span>
    <span class="item-qtd">Quantidade: ${item.quantidade}</span>
  </div>

  <div style="display:flex; align-items:center; gap:1rem;">
    <span class="item-preco">
      ${formatarPreco(item.preco * item.quantidade)}
    </span>

    <button class="btn-remover" onclick="removerItem(${index})">
      Remover
    </button>
  </div>
`;
 
    lista.appendChild(li);
  });
 
  document.getElementById('total-compra').textContent = formatarPreco(calcularTotal(carrinho));
}
 
let descontoAplicado = false;
 
function aplicarDesconto() {
  if (descontoAplicado) {
    alert('Desconto já foi aplicado!');
    return;
  }
 
  const carrinho = lerCarrinho();
 
  const totalComDesconto = carrinho.reduce((acumulador, item) => {
    return acumulador + (item.preco * item.quantidade * 0.9);
  }, 0);
 
  document.getElementById('total-compra').textContent = formatarPreco(totalComDesconto);
  document.getElementById('badge-desc').style.display = 'inline-block';
  document.getElementById('btn-desconto').disabled = true;
  document.getElementById('btn-desconto').style.opacity = '0.5';
 
  descontoAplicado = true;
}
 
function removerItem(index) {
  const carrinho = lerCarrinho();
  carrinho.splice(index, 1);
  salvarCarrinho(carrinho);

  // Reset do desconto pois o total mudou
  descontoAplicado = false;
  document.getElementById('badge-desc').style.display = 'none';
  document.getElementById('btn-desconto').disabled = false;
  document.getElementById('btn-desconto').style.opacity = '1';

  renderizarCarrinho();
}