import ScrollReveal from 'scrollreveal/dist/scrollreveal';


export default {
  init: function() {
    $('#id_selector').hide().text('I was written using jQuery!').fadeIn();

    // Init ScrollReveal
    window.sr = ScrollReveal();
    sr.reveal('.big-icon');
  },
};
