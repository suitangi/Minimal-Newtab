# Cinemagraph Newtab
This extension changes your new tab page so that scenes from Makoto Shinkai's movies can play as seamless, looping cinemagraphs in the background.

The movies included are:
- Kimi no Na Wa (Your Name)
- Byousoku 5 Centimeter (5cm/s)
- Kotonoha no Niwa (Garden of Words)

![Screenshot](/../master/README.md)

## How to use:
1. Install the extension
2. Open a new tab
3. That's it!

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
- Each switch enables/disables respective gadgets
- Darken option: darkens the background so it is easier to see
- Desaturate option: de-saturates the background
- Reset Button: resets the extension, wiping all data and restarts it (use this option when the widget is lost off-screen somehow)

### Bookmarks
- Move the mouse to the right most part of the window to access bookmarks.
- Folders are drop-down-styled, click on them to see contents

## Using Your Own Backgrounds
The `background.json` is styled in such a way:

```json
{
  "default": "default-image-link-here",
  "sources": [{
      "name": "Name of The Source",
      "list": ["link1", "link2", "link3", "..."]

    },
    {
      "name": "Source2",
      "list": ["link1", "link2", "..."]
    }
  ]
}
```

Here's and Example Backgorund Json:
```json
{
  "default": "https://i.imgur.com/t1vt5q0.mp4",
  "sources": [{
      "name": "Your Name",
      "list": ["https://i.imgur.com/OnwkTKE.mp4", "https://i.imgur.com/IpcZlnk.mp4"]

    },
    {
      "name": "Garden of Words",
      "list": ["https://i.imgur.com/IrZ5pEv.mp4", "https://i.imgur.com/gNXhMXN.mp4"]
    }
  ]
}
```
The `background.json` name should not be changed and should be in the resources directory.
The menu for choosing sources will be automatically generated if there is more than one source. It takes the name from the name field in the json of each source.
The saved name in the `chrome.local.stoage` also uses the name field.

## Other Informataion
*Disclaimer: I do not own any of the artwork or cinemagraphs used in this extension. Credit goes to their respective owner (anime stuio/publisher) and original poster cyan1618 on Imgur.*

#### Permissions
- Storage: To store the data relating to preferences and widgets
- Bookmark: To show the bookmarks on the right hand side tab

#### This project uses:
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
