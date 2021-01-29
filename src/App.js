import React, {useEffect, useState} from 'react';
import './App.css';
import Tmdb from './requisition/Tmdb'; //importando requisicao
import MovieRow from './components/MovieRow'; //puxando o componente
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';


export default () => {

  const [movieList, setMovieList] = useState([]); //lista a ser exibida 

  const [featuredData, setFeaturedData] = useState(null); //esperar a lista a ser carregada para exibir o destaque
  const [blackHeader, setBlackHeader] = useState(false); //fundo black dinâmico

  useEffect(() => { //quando a tela for carregada, irá executar a funcao a ser executada.
    const loadAll = async () => {//irá carregar tudo

      //pegando a lista total dos filmes
      let list = await Tmdb.getHomeList();
      setMovieList(list); //mandando a lista à ser exibida

      //depois de pgo a lista, é pegar o filme em destaque ou featured
      //so irá filtrar series da netflix
      let originals = list.filter(i => i.slug === 'originals');     
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv')

      setFeaturedData(chosenInfo);      


    }

    loadAll();
  }, []);

  useEffect(() => {//evento de monitoramento de scroll para o fundo do header black
      const scrollListener = () => {
          //monitorar o scroll da tela
          if (window.scrollY > 10){
              setBlackHeader(true);
          } else {
              setBlackHeader(false);
          }
        }

      window.addEventListener('scroll', scrollListener)
      return () => {
        window.removeEventListener('scroll', scrollListener);
      }
  }, []);


  return (//página -> header-destaque-listas- rodapé
    <div className="page">

        <Header black={blackHeader}/>

        {/*capa de destaque*/}
        { featuredData && //se tiver algum dado, então, é colocado o component e passado os dados
          <FeaturedMovie item={featuredData} />
        }

        <section className="lists">
              {movieList.map((item,key) => (
            
                  <MovieRow key={key} title={item.title} items={item.items}/>//passando o titulo e os items (filmes) para o component
            
              ))}
        </section>      

        <footer>
                Direitos de imagem para Netflix<br/>
                Dados pegos do site Themoviedb.org

        </footer>


        {movieList.length <= 0 &&
        <div className="loading">
             <img src="https://cdn.lowgif.com/small/0534e2a412eeb281-the-counterintuitive-tech-behind-netflix-s-worldwide.gif" alt="carregando"></img> 
        </div>
}
  </div>
  )
}