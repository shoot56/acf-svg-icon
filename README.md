# ACF SVG Icon Field

Welcome to the Advanced Custom Fields SVG Icon repository on Github.

First ideas of this plugin come from [BeAPI/acf-svg-icon](https://github.com/beapi/acf-svg-icon)

Then the plugin was taken from the repository [7studio/acf-svg-icon](https://github.com/7studio/acf-svg-icon)

And modified by the Procoders team to suit their needs

## Description

Add a new ACF field type: "SVG Icon" which allows you to select icon(s) from a SVG sprite.

## Usage

### Choose a SVG file for a specific field

The plugin scans the /images/ folder for svg files and adds them to the field settings


```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
        <path id="BackgroundShape" fill="#efefef" stroke="none" d="…" />
    </defs>
    <!--swp-acf-si:IconTwitter {"title":"Twitter"}-->
    <symbol id="IconTwitter" viewBox="0 0 256 256">
        <use xlink:href="#BackgroundShape" />
        <path fill="currentColor" stroke="none" d="…"/>
    </symbol>
    <symbol id="IconFacebook" viewBox="0 0 256 256">
        <!-- swp-acf-si:IconFacebook {"title":"Facebook", "default_color":"#3b5998"} -->
        <use xlink:href="#BackgroundShape" />
        <g fill="currentColor" stroke="none">
            <path d="…"/>
            <path d="…"/>
        </g>
    </symbol>
</svg>
```

To display the icon, you can use the function
```php
acf_sprite_svg($spriteName, $svgWidth = '24', $svgHeight = '24', $return = '' , $file = "/images/icons.svg" );

// example:
$icon = get_field( 'icon' );

acf_sprite_svg($icon['ID'], 16, 16, '', '/images/social-icons.svg')
```
for example:


You are able to define all your symbols' data into a special HTML comment `<!-- swp-acf-si:{symbol_ID} {key:value} -->` (like Gutenberg settings storage) for each symbols.

## Tips to display icon

```html
<?php $icon = get_field( 'icon' ); ?>
<div class="Icon" style="color:<?php echo esc_attr( $icon['default_color'] ); ?>">
    <svg widht="64" height="64">
        <title><?php echo esc_html( $icon['title'] ); ?></title>
        <use xlink:href="<?php echo esc_url( "{$icon['_file_url']}#{$icon['ID']}" ); ?>"></use>
    </svg>
</div>
```

## Caution

If you use SVGO or something else to optimise your SVG files, you should turn off the remove comments option to keep the plugin extra comments.

## SVGO usage/plugin

If you use SVGO and allowed to add a custom task, you can copy/paste the code below to turn off the `removeComments` task and register a new one which removes comments except if it's important (default behaviour `<!--! my important comment -->`) and if it's needed by ACF SVG Icon Field as well.

```js
{
  removeComments: false
},
{
  stripComments: {
    type: 'perItem',
    description: 'strips comments',
    params: {},
    fn: (item, params) => {
        if (!item.comment) {
          return;
        }

        if (item.comment.charAt(0) !== '!' && ! /^swp-acf-si:/.test(item.comment)) {
          return false;
        }
    }
  }
}
```

