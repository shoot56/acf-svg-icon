( function( $ ) {
    /**
     * Returns the Select2 version number which is used by ACF.
     *
     * @return int
     */
    function get_acf_select2_version() {
        if ( acf.isset( window, 'jQuery', 'fn', 'select2', 'amd' ) ) {
            return 4;
        }

        if ( acf.isset( window, 'Select2' ) ) {
            return 3;
        }

        return false;
    }

    function initialize_field( $el ) {
        var $el_select = $el.find( 'select' );
        var el_select_args = $el_select.data();
        var render_icon = function(id, text) {
            var output = '';
            output += '<span class="select2-swp-acf-si" >';
            output += '<svg class="select2-swp-acf-si__icon" aria-hidden="true" role="img">';
            output += '<use xlink:href="' + el_select_args.file_url + '#' + id + '"></use>';
            output += '</svg>';
            output += text != '' ? '<span class="select2-swp-acf-si__name">' + text + '</span>' : '<span>' + id + '</span>';
            output += '</span>';

            return output;
        };

        acf.add_filter('select2_args', function(select2_args, $select, args, $field) {
            if ($el_select.is($select)) {
                // Determine Select2 version
                var select2_version = acf.select2.version || get_acf_select2_version();

                if (select2_version == 4) {
                    // Customize templateResult and templateSelection for Select2 v4
                    select2_args.templateResult = function(state) {
                        console.log(state);
                        return $(render_icon(state.id, state.text)); // Return jQuery-wrapped HTML element
                    };
                    select2_args.templateSelection = function(state) {
                        console.log(state);
                        return $(render_icon(state.id, state.text)); // Return jQuery-wrapped HTML element
                    };
                } else {
                    // Customize formatResult and formatSelection for Select2 v3
                    select2_args.formatResult = function(result, container, query, escapeMarkup) {
                        console.log(state);
                        return render_icon(result.id, result.text); // Return HTML directly
                    };
                    select2_args.formatSelection = function(object, $container) {
                        console.log(state);
                        return render_icon(object.id, object.text); // Return HTML directly
                    };
                }

                // Configure escapeMarkup to allow HTML
                select2_args.escapeMarkup = function(markup) {
                    return markup; // Do not escape HTML
                };
            }

            return select2_args;
        });

        if (el_select_args) {
            acf.select2.init(
                $el_select,
                el_select_args,
                $el
            );
        }
    }

    if ( typeof acf.add_action !== 'undefined' ) {
        /**
         * ready append (ACF5)
         *
         * These are 2 events which are fired during the page load
         * ready = on page load similar to $(document).ready()
         * append = on new DOM elements appended via repeater field
         *
         * @type    event
         * @date    20/07/13
         *
         * @param   $el (jQuery selection) the jQuery element which contains the ACF fields
         * @return  n/a
         */
        acf.add_action( 'ready append', function( $el ) {
            // search $el for fields of type 'svg_icon'
            acf.get_fields( { type : 'svg_icon' }, $el ).each( function() {
                initialize_field( $( this ) );
            } );
        } );
    }
} )( jQuery );
