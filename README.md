# Minimal Newtab
This project is a Google Chrome/Firefox Newtab replacement framework that allows for custom defined lists of backgrounds to be loaded into a minimalistic page such that every time a new tab is opened, a random background is loaded.

![Screenshot](https://raw.githubusercontent.com/suitangi/Minimal-Newtab/master/resources/SC.png)

## Usage
These are some of the published extensions with this framework:
* [Shinkai's Newtab](https://suitangi.github.io/Minimal-Newtab/resources/Shinkai's%20Newtab):
  * [Chrome](https://chrome.google.com/webstore/detail/ojaookiigngaiipdhccdoaalmjpgpigh/publish-accepted?authuser=0&hl=en)
  * [Firefox](https://addons.mozilla.org/en-US/firefox/addon/garden-of-words-newtab/)

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

### Todo List:
- Type in the "New Item" box and press Enter to enter a new item
- Press enter while editing a list item to create a new list item below
- Press backspace on any empty list item to delete it
- Left click on items to edit them
- Click on the x next to the item to delete it
- Right click on the item to cross them off
- Drag and drop the item to reorder the list
- Drag the top of the list (where it says "todo list") to move the widget

### Search Bar:
- Drag from the top of the search bar to move it
- Type in the box and press enter to perform a Google search

### Menu
- Move the mouse to the left most part of the window to access the menu.
- Each switch in **Widgets** enables/disables respective widgets
- Each switch in **Background** enables/disables the respective source of images
- Effects:
  - Brightness: adjust the brightness of the background
  - Saturation: adjust the saturation (how colorful) of the background
  - Contrast: adjust the contrast of the background
  - Blur: adjust the blur of the background (default is no blur)
- ❤ : Add or remove the current background to favorites
- 🗑️: Remove this background (won't show this background again)
- Reset Button: resets the extension, wiping all data and restarts it (use this option when the widget is lost off-screen somehow)
- About Button: see information regarding the extension
  - Report background: used to report a broken/low quality background

### Bookmarks
- Move the mouse to the right most part of the window to access bookmarks.
- Folders are drop-down-styled, click on them to see contents

## Using Your Own Backgrounds
The `background.json` is styled in such a way:

```json
{
  "default": {
    "link": "default-link",
    "metadata1": "metadata1",
    "metadata2": "metadata2"
  },
  "info" : [
    ["metadata1", "metadata2"],
    ["metadata2"]
  ],
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
        },
        { "link": "link3",
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
        },
        { "link": "link6",
          "metadata1": "metadata1",
          "metadata2": "metadata2"
        }]
    }
  ]
}
```


Here's and Example Backgorund Json (with no metadata):
```json
{
  "default": {
    "link": "https://i.imgur.com/t1vt5q0.mp4"
  },
  "info": [
    ["source"]
  ],
  "sources": [{
      "name": "Your Name",
      "list": [{
          "link": "https://i.imgur.com/OnwkTKE.mp4"
        },
        {
          "link": "https://i.imgur.com/IpcZlnk.mp4"
        }]
    },
    {
      "name": "Garden of Words",
      "list": [{
        "link": "https://i.imgur.com/IrZ5pEv.mp4"
        },
        {
          "link": "https://i.imgur.com/gNXhMXN.mp4"
        }]
    }
  ]
}
```
The `background.json` name should not be changed and should be in the resources directory.
The menu for choosing sources will be automatically generated. It takes the title from the `name:` field in the json of each `source`.
The `info` field is a list that determines how the background metadata is shown. `"source"` refers to the source of the background, which isn't located in the metadata of the background, but can still be retrieved.

## Other Informataion
*Disclaimer: I do not own any of the artwork or cinemagraphs used in this extension. Credit goes to their respective owners.*

### Browser Permissions
These are the permission that the `manifest.json` asks for:
- Storage: To store the data relating to preferences and widgets
- Bookmark: To show the bookmarks on the right hand side tab

### jQuery
This project uses these jQuery libraries:
- [jQuery](https://github.com/jquery/jquery)
- [jQuery-confirm](https://github.com/craftpip/jquery-confirm)
- [jQuery-ui](https://github.com/jquery/jquery-ui)

## Change-Log
```
1.6.2 Todo list rework
1.6.1 Todo list new functions: reordering and editing
1.6.0 Revamped background filter effects system
1.5.1 Button bug fixes, dynamic menu bugfixes
1.5.0 Added updated menu and bookmarks panel
1.4.3 Bug fixes, menu now scrollable, slight font adjustments
1.4.1 Bug fixes, Added animations for widgets, Background changes
1.4.0 Original Release: Garden of Words Newtab
```
