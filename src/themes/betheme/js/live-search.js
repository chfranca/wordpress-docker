/* jshint esversion: 6 */

var Mfn_livesearch = {
  that: this, //helper for `this` overwritting for event

  postsLoaded: [],

  dom : {
    ajaxFetchedPage: '', //only for getter below
    get resultsFromPage() { return this.ajaxFetchedPage; },

    //inputs
    get searchForm() {
      return Array.from(document.querySelectorAll('.search_wrapper #searchform, .top-bar-search-form, #Side_slide #side-form'));
    },
    get searchField() {
      return Array.from(document.querySelectorAll('.search_wrapper input[type=text], .top-bar-search-form input[type=text], #Side_slide #side-form input[type=text]'));
    },

    //no results
    get liveSearchNoResults() {
      return Array.from(document.querySelectorAll('.mfn-live-search-box .mfn-live-search-noresults'));
    },

    //Main containers
    get liveSearchBox() {
      return Array.from(document.querySelectorAll('.mfn-live-search-box'));
    },
    get liveSearchResultsList() {
      return Array.from(document.querySelectorAll('.mfn-live-search-list'));
    },
    get liveSearchResultsListShop() {
      return Array.from(document.querySelectorAll('.mfn-live-search-list-shop ul'));
    },
    get liveSearchResultsListBlog() {
      return Array.from(document.querySelectorAll('.mfn-live-search-list-blog ul'));
    },
    get liveSearchResultsListPortfolio() {
      return Array.from(document.querySelectorAll('.mfn-live-search-list-portfolio ul'));
    },
    get liveSearchResultsListPages() {
      return Array.from(document.querySelectorAll('.mfn-live-search-list-pages ul'));
    },
    get liveSearchResultsListCategories() {
      return Array.from(document.querySelectorAll('.mfn-live-search-list-categories ul'));
    },
  },

  create: {
    that: this,

    //constructors
    linkToLivesearch: (inputValue) => `${mfn.site_url}?s=${inputValue}&mfn_livesearch`,

    Li: () => document.createElement("li"),
    Heading: (post) => post.querySelector( '.post-title'),
    Link:  (post) => post.querySelector( '.post-title a'),
    Excerpt: (post) => post.querySelector( '.post-excerpt p' ),
    WooPrice: (post) => post.querySelector('.post-product-price'),
    Image(post) {
      const imgDom = post.querySelector('.post-featured-image img');

      if( imgDom ) {
        let imgDomCreate = document.createElement('img');
        imgDomCreate.src = imgDom.src;

        return imgDomCreate;
      }
    },
    Category(post) {
      switch(true){
        case post.classList.contains('product'):
          return 'product';
        case post.classList.contains('page'):
          return 'page';
        case post.classList.contains('portfolio'):
          return 'portfolio';
        case post.classList.contains('post'):
          return 'post';
      }
    },
    Textbox(heading, link, excerpt, wooPrice) {
      // textbox
      // is a heading with href and excerpt
      let headingCreate = document.createElement('a');
      let excerptCreate = document.createElement("p");
      let wooPriceCreate = document.createElement("span");
      let container = document.createElement("div");
        container.classList.add("mfn-live-search-texts");

      //text (heading) is wrapped in link
      if (heading.textContent && link.href ) {
        headingCreate.innerHTML = heading.textContent;
        headingCreate.href = link.href;

        container.appendChild(headingCreate);
      }

      if(wooPrice) {
        wooPriceCreate.innerHTML = wooPrice.textContent;

        container.appendChild(wooPriceCreate);
      }

      if ( excerpt != null && excerpt.textContent.match(/\w/) )  {
        let finalExcerpt = '';

        /* Cut letter in limit*/
        const letterLimit = 90;
        const sentence = excerpt.innerHTML;

        if (letterLimit >= sentence.length) {
          finalExcerpt = sentence;
        }else{
          finalExcerpt = `${sentence.substr(0, sentence.lastIndexOf(' ', letterLimit))}...`;
        }

        excerptCreate.innerHTML = finalExcerpt;
        container.appendChild(excerptCreate);
      }

      return container;
    },
    readyList(e) {
      var that = this.that;
      //Ajax fetched page
      let remotePageSource = that.Mfn_livesearch.dom.resultsFromPage;
        remotePageSource = jQuery(remotePageSource).find('.posts_group');
      //if posts exists
      if (remotePageSource.length) {
        const [{ children: posts }] = remotePageSource;

        //HTML -> ARRAY
        Array.from(posts).forEach(post => {
          let Li = this.Li();

          //utils, id of post could be useful!
          this.postId = post.id.match(/\d+/g).toString();

          //if featured image exists, push it
          if ( _.isObject(this.Image( post )) ) Li.appendChild( this.Image( post )  );


          //prepare the textbox & push to li
          const textbox = this.Textbox( this.Heading(post), this.Link(post), this.Excerpt(post), this.WooPrice(post)  );
          Li.setAttribute('data-category', this.Category(post));

          //finish
          Li.appendChild( textbox );

          //push to main container
          that.Mfn_livesearch.postsLoaded.push( Li );
        });
      } else if (e.target.value.length && !that.Mfn_livesearch.postsLoaded.length) {
        //if form is filled, but there is no posts
        jQuery(that.Mfn_livesearch.dom.liveSearchNoResults).fadeIn();
      }
    },
    categoryPills(actualInput){
      var that = this.that;
      // method of variable

      if(mfn_livesearch_categories){
        const regex = new RegExp(`[a-zA-Z]*${actualInput}[a-zA-Z]*`, 'gi');

        const similarResults = Object.values(mfn_livesearch_categories).filter(function(category){
          return category.match(regex);
        });

        similarResults.forEach(category => {

          let Li = this.Li();
          Li.setAttribute('data-category', 'category');

          let text = document.createElement('a');
          text.innerHTML = category;
          text.href = Object.keys(mfn_livesearch_categories).find(key => mfn_livesearch_categories[key] === category);

          Li.appendChild(text);

          that.Mfn_livesearch.postsLoaded.push( Li );

        });
      }
    }
  },

  ajaxSearch(that, e) {
    if(e.target.value.length >= mfn.livesearchCharacters){
      jQuery('#searchform, #side-form').addClass('mfn-livesearch-loading');

      jQuery.ajax({
        url: this.Mfn_livesearch.create.linkToLivesearch(e.target.value),
        type: "GET",
        success: function (response) {
          that.Mfn_livesearch.dom.ajaxFetchedPage = response;

          setTimeout(function(){
            jQuery('#searchform, #side-form').removeClass('mfn-livesearch-loading');

            that.Mfn_livesearch.postsLoaded = []; //remove previous results,
            jQuery(that.Mfn_livesearch.dom.liveSearchNoResults).fadeOut();

            that.Mfn_livesearch.create.categoryPills(e.target.value); //CATEGORY PILLS ARE JUST NAMES OF ALL CATEGORIES!
            that.Mfn_livesearch.create.readyList(e); //wrapped in this.postsLoaded(), load posts

            that.Mfn_livesearch.refreshCategoryContainers();
            that.Mfn_livesearch.assignToProperContainer(that.Mfn_livesearch.postsLoaded);
            that.Mfn_livesearch.hideNotUsedCategories();

            //Front-end effects
            that.Mfn_livesearch.toggleDropdown(e);
            that.Mfn_livesearch.toggleMoreResultsButton(e);
          }, 0);
        }
      });
    } else {
      //close, when not enough characters
      that.Mfn_livesearch.toggleDropdown(e);
    }
  },

  refreshCategoryContainers(){
    const containers = this.that.Mfn_livesearch.dom;

    jQuery(containers.liveSearchResultsListShop).html('<li data-category="info"> Products </li>');
    jQuery(containers.liveSearchResultsListPages).html('<li data-category="info"> Pages </li>');
    jQuery(containers.liveSearchResultsListPortfolio).html('<li data-category="info"> Portfolio </li>');
    jQuery(containers.liveSearchResultsListBlog).html('<li data-category="info"> Posts </li>');
    jQuery(containers.liveSearchResultsListCategories).html('<li data-category="info"> Categories </li>');
  },

  assignToProperContainer(posts){
    var that = this.that;

    posts.forEach(post =>{
      switch(post.getAttribute('data-category')){
        case 'product':
          jQuery(that.Mfn_livesearch.dom.liveSearchResultsListShop).append(post);
          break;
        case 'page':
          jQuery(that.Mfn_livesearch.dom.liveSearchResultsListPages).append(post);
          break;
        case 'portfolio':
          jQuery(that.Mfn_livesearch.dom.liveSearchResultsListPortfolio).append(post);
          break;
        case 'post':
          jQuery(that.Mfn_livesearch.dom.liveSearchResultsListBlog).append(post);
          break;
        case 'category':
          jQuery(that.Mfn_livesearch.dom.liveSearchResultsListCategories).append(post);
          break;
      }

    });
  },

  hideNotUsedCategories(){
    var that = this.that;

    that.Mfn_livesearch.dom.liveSearchResultsList.forEach(resultsList =>{

      Array.from(resultsList.children).forEach(category => {
        let content = category.querySelectorAll('ul li[data-category]');

        if(content.length === 1){ //1 means there is no items
          category.style.display = "none";
        }else{
          category.style.display = "block";
        }
      });

    });
  },

  toggleDropdown(e) {
    let focusedSearchBox; //DOM

    if(document.querySelector('#Side_slide') && document.querySelector('#Side_slide').style.right === '0px'){
      focusedSearchBox = document.querySelector('#Side_slide .mfn-live-search-box');
    }else if(document.querySelector('.search_wrapper') && document.querySelector('.search_wrapper').style.display === 'block'){
      focusedSearchBox = document.querySelector('.search_wrapper .mfn-live-search-box');
    }else{
      focusedSearchBox = document.querySelector('.top-bar-search-form .mfn-live-search-box');
    }

    //jquery has nice animations, so why not to use them
    if ( e.target.value.length < mfn.livesearchCharacters) {
      return jQuery(focusedSearchBox).slideUp(300);
    }

    jQuery(focusedSearchBox).slideDown(300);
  },

  toggleMoreResultsButton(e) {
    this.dom.liveSearchBox.forEach(searchBox => {
      const getMoreResultsButton = searchBox.querySelector('a.button'); //button in live search box

      if ( this.postsLoaded.length >= mfn.livesearchPostsAmountLoad && this.postsLoaded.length ) {
        getMoreResultsButton.classList.remove('hidden');
        getMoreResultsButton.href = this.create.linkToLivesearch(e.target.value);
      } else {
        getMoreResultsButton.classList.add('hidden');
      }
    });
  },

  events() {
      //AJAX
      var inputDebounce = _.debounce(this.ajaxSearch, 300);

      //form loop
      this.dom.searchForm.forEach(searchForm => {
        //prevent submitting form
        searchForm.addEventListener("submit", (e) => e.preventDefault());
      });

      //field loop
      this.dom.searchField.forEach(searchField => {
        //On click, load the search interaction
        searchField.addEventListener("click", (e) => { inputDebounce(this.that, e); });

        //On input
        searchField.addEventListener("input", (e) => inputDebounce(this.that, e) /* hocus pocus, grab the focus :D */ );

        //Slide the dropdown, when click at anything but live searchbox and input
        searchField.addEventListener("click", (e) => e.stopPropagation());
      });

      //Slide the dropdown, when click at anything but live searchbox and input
      this.dom.liveSearchBox.forEach(searchBox => {
        searchBox.addEventListener("click", (e) => e.stopPropagation());
      });
      document.addEventListener("click", () => jQuery(".mfn-live-search-box").slideUp(300));
  },

  init(){
    this.events();
  }
};

Mfn_livesearch.init();
