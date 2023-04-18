# This Branch is for a full rework of the code, this readme is a todo list
- Long awaited weather widget
- Locale support
- Config file
- Debug options and testing
 - Real logging
- Offline options for backgrounds
- Better docs better website
- Code rewrite: cleaner, better, and more optimized
- Use npm for builds
 - Automate builds for different browsers
 - Potentially no-code UI build
- Optimize for hardware acceleration for videos (potentially disabling effects without HA)
  

# ![icon](https://raw.githubusercontent.com/suitangi/Minimal-Newtab/master/chrome-extension/icons/icon48.png) Minimal Newtab
This project is a Google Chrome/Firefox Newtab replacement framework that allows for custom defined lists of backgrounds to be loaded into a minimalistic page such that every time a new tab is opened, a random background is loaded.

![Screenshot](https://i.imgur.com/hlx28h5.gif)

![Screenshot2](https://raw.githubusercontent.com/suitangi/Minimal-Newtab/master/resources/Images/SC2.png)
## Usage
These are some of the published extensions with this framework:
* [Shinkai's Newtab](https://suitangi.github.io/Minimal-Newtab/resources/Shinkai's%20Newtab):
  * [Chrome](https://chrome.google.com/webstore/detail/ojaookiigngaiipdhccdoaalmjpgpigh/)
  * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/garden-of-words-newtab/)
* [MTG Art Newtab](https://suitangi.github.io/Minimal-Newtab/resources/MtG%20Art%20Newtab):
  * [Chrome](https://chrome.google.com/webstore/detail/mtg-art-newtab/nakflbaaglkajjpbfnpjmpjaakbjlpfl)
  * [Firefox](https://suitangi.github.io/Minimal-Newtab/resources/MtG%20Art%20Newtab)

You can also clone this repository:
```
git clone https://github.com/suitangi/Minimal-Newtab.git
```
Just make sure to turn on developer options in chrome://extensions/ and 'Load Unpacked' and then select the folder where the `manifest.json` file is located.
This option allows you to [use your own background lists](#using-your-own-backgrounds).

## Features
### Clock:
- Drag to move the clock
- Click once to switch between standard 12hr and 24hr time

![change time style](https://i.imgur.com/gsC0Lz5.gif)

### Info Panel:
- Shows the info about the current background shown
- Click to show different information and in a different style
- Drag to move the info widget

![info demo](https://i.imgur.com/vvEC3su.gif)

### Todo List:
- Type in the "New Item" box and press Enter to enter a new item
- Press enter while editing a list item to create a new list item below
- Press backspace on any empty list item to delete it
- Left click on items to edit them
- Click on the x next to the item to delete it
- Right click on the item to cross them off
- Drag and drop the item to reorder the list
- Drag the top of the list (where it says "todo list") to move the widget

![using todo list](https://i.imgur.com/CtGcsnQ.gif)

### Search Bar:
- Drag the top of the search bar to move it
- Type in the box and press enter to perform a search
- On the right side of the search bar there is a ⯈ button to change the search engine

![Change search engine](https://i.imgur.com/jsSynRH.gif)

### Menu
![menu](https://i.imgur.com/RoTnqtU.gif)
- Move the mouse to the left most part of the window to access the menu.
- Each switch in **Widgets** enables/disables respective widgets
- Each switch in **Background** enables/disables the respective source of images
- Effects: see [effects](#Effects)
- ❤ Button: Add or remove the current background to favorites
- 🗑️ Button: Remove this background (won't show this background again)
- Settings Button:
  - UI Animations: Toggles the UI Animations
  - Avoid Repeats: When on, the extension will not allow the same background to be shown back to back
  - Auto-pause background: When on, this option will pause video backgrounds when the window is not in focus to reduce cpu usage
  - Reset Data: resets the extension based on options checked, wiping the chosen data and restarts the software (use this option when the widget is lost off-screen somehow)
- About Button: see information regarding the extension
  - FAQ: redirect to FAQ page
  - Report background: used to report a broken/low quality background

### Effects
  - Brightness: adjust the brightness of the background
  - Saturation: adjust the saturation (how colorful) of the background
  - Contrast: adjust the contrast of the background
  - Blur: adjust the blur of the background (default is no blur)

![effects demo](https://i.imgur.com/H82sqcW.gif)

### Bookmarks
- Move the mouse to the right most part of the window to access bookmarks.
- Folders are drop-down-styled, click on them to see contents

![bookmarks demo](https://i.imgur.com/3fgvKxo.gif)

## Using Your Own Backgrounds
The `background.json` is styled in such a way:

```json
{
  "default": {
    "link": "default-link",
    "metadata1": "metadata1",
    "metadata2": "metadata2"
  },
  "info_title": "title of info",
  "info" : [
    [{
      "name": "metadata1",
      "size": "large"
      },
      {
        "name": "metadata2",
        "size": "medium"
      }],
    [{
      "name": "metadata2",
      "size": "small"
      }]
  ],
  "support_link": "http://yoursupportlink.here",
  "report_embed": "<iframe>HTML embed here</iframe>",
  "sources": [{
      "name": "Name of The Source1",
      "list": [
        { "link": "link1",
        "metadata1": "metadata1",
        "metadata2": "metadata2"
        },
        { "link": "link2",
          "metadata1": "metadata1",
          "metadata2": "metadata2"
        }]
    },
    {
      "name": "Source2",
      "list": [
        { "link": "link4",
        "metadata1": "metadata1",
        "metadata2": "metadata2"
        },
        { "link": "link5",
          "metadata1": "metadata1",
          "metadata2": "metadata2"
        }]
    }
  ]
}
```

The `background.json` name should not be changed and should be in the resources directory.
The menu for choosing sources will be automatically generated. It takes the title from the `name:` field in the json of each `source`.

More details of the `background.json` can be found [here](https://suitangi.github.io/Minimal-Newtab/resources/Background%20JSON).

## Other Informataion
*Disclaimer: I do not own any of the artworks or cinemagraphs used in this extension. Credit goes to their respective owners.*

If there is any issue with copyright or if you're the owner of one of the art, please contact suitangi778@gmail.com to take it down.

### Browser Permissions
These are the permission that the `manifest.json` asks for:
- Storage: To store the data relating to preferences and widgets
- Bookmark: To show the bookmarks on the right hand side tab

### jQuery
This project uses these jQuery libraries:
- [jQuery](https://github.com/jquery/jquery)
- [jQuery-confirm](https://github.com/craftpip/jquery-confirm)
- [jQuery-ui](https://github.com/jquery/jquery-ui)

## Special Thanks
To all the beta test users:
- [G-Jayakar](https://github.com/G-Jayakar)
- [DaisyFei](https://github.com/DaisyFei)

## Change-Log
```
1.8.0 Optimization, Standardized modal, Added Advanced Options
1.7.3 Optimization and small bug fixes
1.7.2 Updated JQuery Version
1.7.1 Fixed some issues and bugs
1.7.0 Made into minimal newtab framework
1.6.2 Todo list rework
1.6.1 Todo list new functions: reordering and editing
1.6.0 Revamped background filter effects system
1.5.1 Button bug fixes, dynamic menu bugfixes
1.5.0 Added updated menu and bookmarks panel
1.4.3 Bug fixes, menu now scrollable, slight font adjustments
1.4.1 Bug fixes, Added animations for widgets, Background changes
1.4.0 Original Release: Garden of Words Newtab
```
