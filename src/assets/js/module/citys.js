define(['jquery'], function($) {

    var main = {
        $container: $('#main'),
        $menu: $('#menu'),
        $items: null,
        list: [],
        itemIndex: 0,

        init: function() {
            this.getCitys();
        },

        getCitys: function() {
            $.ajax({
                url: '/api/supportCitys',
                type: 'GET',
                context: this,
                success: function(res) {
                    if (res.code === 0) {
                        this.list = this.PYSort(res.data);
                        this.$container.html(this.buildList(this.list));
                        this.$menu.html(this.buildMenu(this.list));
                        this.bindEvent();
                    } else {
                        console.log(res);
                    }
                }
            })
        },

        buildList: function(data) {
            var str = '';

            for (var i = 0, l = data.length; i < l; i++) {
                str += '<dl>'
                    +       '<dt>' + data[i].letter.toUpperCase() + '</dt>';

                for (var j = 0, l2 = data[i].data.length; j < l2; j++) {
                    str += '<dd class="re-bb">' + data[i].data[j] + '</dd>'
                }

                str += '</dl>';
            }

            return str;
        },

        buildMenu: function(data) {
            var str = '';

            for (var i = 0, l = data.length; i < l; i++) {
                str += '<li data-index="' + i + '">' + data[i].letter.toUpperCase() + '</li>';
            }

            return str;
        },

        scrollTo: function(index) {
            if (this.itemIndex !== index) {
                this.itemIndex = index;
                $('html, body').scrollTop(this.$items.eq(index).offset().top);
            }
        },

        bindEvent: function() {
            var that = this;

            this.$items = this.$container.find('dl');
            this.$menu.on('touchstart touchmove', function(event) {
                event.preventDefault();
                try {
                    var index = document.elementFromPoint(event.touches[0].clientX,event.touches[0].clientY).getAttribute('data-index');
                    if (index) {
                        that.scrollTo(index);
                    }
                } catch (err) {}
            })
        },

        PYSort: function(arr, empty) {
            if(!String.prototype.localeCompare)
                return null;
             
            var letters = "*abcdefghjklmnopqrstwxyz".split(''),
                zh = "阿八嚓哒妸发旮哈讥咔垃痳拏噢妑七呥扨它穵夕丫帀".split('');
             
            var totalList = [];

            for (var i = 0; i < letters.length; i++) {
                var curr = {
                    letter: letters[i],
                    data:[]
                };

                for (var arrKey in arr) {
                    if ((!zh[i-1] || zh[i-1].localeCompare(arr[arrKey]) <= 0) && arr[arrKey].localeCompare(zh[i]) == -1) {
                        curr.data.push(arr[arrKey]);
                    }
                }

                if (empty || curr.data.length) {
                    curr.data.sort(function(a,b) {
                        return a.localeCompare(b);
                    });
                    totalList.push(curr);
                }
            }
            return totalList;
        }
    }

    main.init();
})