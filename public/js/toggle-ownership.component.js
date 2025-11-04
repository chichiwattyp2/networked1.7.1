/* global AFRAME, NAF, THREE */
/**
 * Rotate the entity every frame if you are the owner.
 * When you press enter take ownership of the entity,
 * spin it in the opposite direction and change its color.
 */



AFRAME.registerComponent('toggle-ownership', {
  schema: {
    speed: { default: 0.01 },
    direction: { default: 1 }
  },

  init() {
    var that = this;
    this.onKeyUp = this.onKeyUp.bind(this);
    document.addEventListener('keyup', this.onKeyUp);

    NAF.utils.getNetworkedEntity(this.el).then((el) => {
      if (NAF.utils.isMine(el)) {
        console.log('the video is mine!');
      } else {
        console.log('took the ownership...')
      }

      // Opacity is not a networked attribute, but change it based on ownership events
      //let timeout;

      el.addEventListener('ownership-gained', e => {
      //  that.updateOpacity(1);

      });

      el.addEventListener('ownership-lost', e => {
      //  that.updateOpacity(0.5);
      });

      el.addEventListener('ownership-changed', e => {
        //clearTimeout(timeout);
        console.log(e.detail)

        if (e.detail.newOwner == NAF.clientId) {
          //same as listening to 'ownership-gained'
          alert('Przejęto synchronizacje elementu video');
        } else if (e.detail.oldOwner == NAF.clientId) {
          //same as listening to 'ownership-lost'
          alert('Utracono synchronizacje elementu video');
        } else {
        /*  that.updateOpacity(0.8);
          timeout = setTimeout(() => {
            that.updateOpacity(0.5);
          }, 200)*/
        }

      });
    });
  },

  onKeyUp(e) {




    if (e.keyCode !== 13 /* enter */) {
      return;
    }

    //updateColor();

    if(NAF.utils.takeOwnership(this.el)) {
      this.el.setAttribute('toggle-ownership', { direction: this.data.direction * -1 });
    }

  }




});
