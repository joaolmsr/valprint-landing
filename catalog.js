(() => {
  'use strict';
  // Add a relative image path to each product when its final photo is available.
  const catalogs = {
    personalizados: { name: 'Personalizados', products: [
      {name:'Troféu de beach tennis', image:''},
      {name:'Chaveiro com nome', image:''},
      {name:'Chaveiro com logo', image:''}
    ]},
    estatuas: { name:'Estátuas e Bonecos', products:[
      {name:'Venom', image:'val-print-boneco-venom.png'},
      {name:'Alien dourado', image:'val-print-boneco-alien-dourado.png'},
      {name:'Goku', image:'val-print-boneco-goku.png'},
      {name:'Mascote do Fortaleza', image:'val-print-mascote-fortaleza.png'},
      {name:'Mascote do Palmeiras', image:'val-print-mascote-palmeiras.png'},
      {name:'Mascote do Ceará', image:'val-print-mascote-ceara.png'},
      {name:'Mascote do Flamengo', image:'val-print-mascote-flamengo.png'},
      {name:'Esculturas geométricas', image:'val-print-esculturas-geometricas.png'}
    ]},
    natal: { name:'Especial Natal', products:[
      {name:'Renas decorativas', image:'val-print-renas-natal.png'},
      {name:'Árvore de Natal', image:'val-print-arvore-natal.png'},
      {name:'Presépio', image:'val-print-presepio-natal.png'},
      {name:'Porta-terço Nossa Senhora', image:'val-print-porta-terco-nossa-senhora-natal.png'},
      {name:'Porta-terço Sagrado Coração', image:'val-print-porta-terco-sagrado-coracao-natal.png'},
      {name:'Santos personalizados', image:'val-print-escultura-frade-natal.png'}
    ]},
    utilidades: { name:'Utilidades', products:[
      {name:'Placa de avaliação Google', image:'val-print-placa-google.png'},
      {name:'Organizadores e bandejas', image:'val-print-organizadores-bandejas.png'},
      {name:'Placa Pix', image:'val-print-placa-pix.png'},
      {name:'Case para microfone Hollyland', image:'val-print-case-microfone-hollyland.png'},
      {name:'Porta-medalha', image:'val-print-porta-medalha.png'}
    ]}
  };
  const track=document.getElementById('catalog-track');
  const cards=[...track.querySelectorAll('.catalog-card')];
  const prev=document.getElementById('catalog-prev');
  const next=document.getElementById('catalog-next');
  const status=document.getElementById('catalog-position');
  const dialog=document.getElementById('catalog-dialog');
  const title=document.getElementById('catalog-title');
  const products=document.getElementById('catalog-products');
  const reduce=matchMedia('(prefers-reduced-motion: reduce)');
  let opener=null, pushed=false, frame=0;
  function position(){
    const left=track.getBoundingClientRect().left;
    let index=0, distance=Infinity;
    cards.forEach((card,i)=>{const d=Math.abs(card.getBoundingClientRect().left-left);if(d<distance){distance=d;index=i;}});
    return index;
  }
  function update(){
    prev.disabled=track.scrollLeft<=2;
    next.disabled=track.scrollLeft+track.clientWidth>=track.scrollWidth-2;
    status.textContent=(position()+1)+' de '+cards.length;
  }
  function move(direction){
    const card=cards[0];
    const gap=parseFloat(getComputedStyle(track).gap)||0;
    track.scrollBy({left:direction*(card.getBoundingClientRect().width+gap),behavior:reduce.matches?'instant':'smooth'});
  }
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));
  track.addEventListener('scroll',()=>{cancelAnimationFrame(frame);frame=requestAnimationFrame(update);},{passive:true});
  window.addEventListener('resize',update);
  track.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});
  function render(key){
    const catalog=catalogs[key];title.textContent=catalog.name;products.replaceChildren();
    catalog.products.forEach(product=>{
      const article=document.createElement('article');article.className='catalog-product';
      const photo=document.createElement('div');photo.className='product-photo';
      if(product.image){const image=document.createElement('img');image.src=product.image;image.alt=product.name;image.loading='lazy';image.width=600;image.height=600;photo.append(image);}
      else{photo.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="8" cy="8" r="1.5"/><path d="m3 17 6-6 4 4 3-3 5 5"/></svg><span>Foto em breve</span>';}
      const info=document.createElement('div');info.className='product-info';
      const heading=document.createElement('h3');heading.textContent=product.name;
      const link=document.createElement('a');link.className='product-quote';link.textContent='Fazer orçamento';
      link.href='https://wa.me/558585102140?text='+encodeURIComponent('Olá, Val Print! Gostaria de um orçamento do produto '+product.name+' (catálogo '+catalog.name+').');
      link.target='_blank';link.rel='noopener noreferrer';link.setAttribute('aria-label','Fazer orçamento: '+product.name);
      info.append(heading,link);article.append(photo,info);products.append(article);
    });
  }
  function sync(){
    const key=location.hash.replace('#catalogo-','');
    if(Object.hasOwn(catalogs,key)&&location.hash.startsWith('#catalogo-')){
      render(key);
      if(!dialog.open){dialog.showModal();document.documentElement.classList.add('catalog-open');}
      dialog.scrollTop=0;title.focus({preventScroll:true});
    }else if(dialog.open){dialog.close();document.documentElement.classList.remove('catalog-open');if(opener)opener.focus({preventScroll:true});}
  }
  function close(){
    if(pushed){pushed=false;history.back();}
    else{history.replaceState(null,'',location.pathname+location.search+'#catalogos');sync();}
  }
  cards.forEach(card=>card.addEventListener('click',e=>{
    e.preventDefault();opener=card;pushed=true;
    history.pushState(null,'',card.getAttribute('href'));sync();
  }));
  document.getElementById('catalog-back').addEventListener('click',close);
  dialog.addEventListener('cancel',e=>{e.preventDefault();close();});
  dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)close();}});
  window.addEventListener('popstate',sync);
  window.addEventListener('hashchange',sync);
  update();sync();
})();

