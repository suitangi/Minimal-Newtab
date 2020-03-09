---
title: Minimal Newtab
description: Background JSON Documentation
---

# Background JSON

### Example
[Here's](https://raw.githubusercontent.com/suitangi/Minimal-Newtab/master/resources/exampleBackground.json) an Example `backgorund.json` of some famous Paintings

## Details

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| [`"default"`](#default) | Standard background object | No, but highly recommended | The default background shown if some error occurred or if other backgrounds can't be displayed. |
|[ `"info_title"`](#info-title) | String | No, but required if `"info"` is defined | The text name displayed in the menu option and hover of the info widget. |
| [`"info"`](#info) | List | No | A list of what, and how the data in the information widget displays. |
| `"support_link"` | String | No | The link to your support page. If no link is provided, the Minimal Newtab Project page will be provided instead. |
| [`"report_embed"`](#report-embed) | String | Yes | The HTML embed for your report form. You can use `\\back` to get the URL-encoded Standard background object of the user's current background. |
| `"type"` | String | Yes | `"image"` or `"video"` or `"both"` to designate what type of backgrounds are to be loaded (to facilitate with the loading process).
| [`"sources"`](#sources) | List | Yes | A list of sources, each source contains `"name"` (the name of the source) and "`list`" (the list of standard background objects belonging to the source).

### Standard background object
 This just a Json object styled as such:
 it contains a `"link"` and as many different metadata tags as the image has. For example, Mona Lisa's background Json might look like this:
```JSON
  {
    "link": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    "title": "Mona Lisa",
    "year": "1503",
    "painter": "Leonardo Da Vinci"
  }
```

### Default
Default background that will be shown in the following scenarios:
- No background sources were selected by the user
- All possible backgrounds active (selected by the user) have also been blacklisted (removed) by the user.

Use like this:
```JSON
  "default": {
    "link": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
    "title": "Mona Lisa",
    "year": "1503",
    "painter": "Leonardo Da Vinci"
  }
```

### Info Title
The text name displayed in the menu option and hover of the info widget. For example, an extension of paintings could be `  "info_title": "Painting Info"`.

![info_title demo](https://i.imgur.com/z5OXtFk.gif)

### Info
The `"info"` field in the json is a list. Each element of the list is a "mode" of the info widget. Each mode has a list of metadata to display and attributes to modify the display.
For example, the info display is set to have 3 modes:
1. Painting Title (large text), Painter (medium text), Year (small text)
2. Painting Title (medium text), Painter (small text), Genre (small text)
3. Painting Title (medium text)

The `"info"` list would look like this:
```JSON
"info": [
  [
    {
      "name": "title",
      "size": "large"
    },
    {
      "name": "painter",
      "size": "medium"
    },
    {
      "name": "year",
      "size": "small"
    }
  ],
  [
    {
      "name": "title",
      "size": "medium"
    },
    {
      "name": "painter",
      "size": "small"
    },
    {
      "name": "source",
      "size": "small"
    }
  ],
  [
    {
      "name": "title",
      "size": "medium"
    }
  ]]
```

Even though the source of the background isn't defined in the metadata (rather, each background is stored in the list of each source), the source can be accessed in the info using `"name": "source"`. In the example, the sources are sorted by genre, so in the second mode, we use `source` to display the genre of the background.

The info widget will have this behavior when clicked:

![info demo](https://i.imgur.com/vvEC3su.gif)

### Report Embed
The `"report_embed"` in the json is the HTML embed for your report form. You can use `\\back` to get the URL-encoded Standard background object of the user's current background.
In the other projects, the embed used Google forms to provide a bug reporting feature as such:
```
"<iframe src='https://docs.google.com/forms/d/e/1FAIpQLSeeJuD-3LOxM2pJniVo2BCOLmIPctBQDdOkEg4Ejr9n29gNng/viewform?embedded=true?usp=pp_url&entry.2076178066=\\back' width='640' height='640' frameborder='0' marginheight='0' marginwidth='0'>Loading...</iframe>"
```
*Do not copy the above into your project! This is only an example and you will not get any bugs reported this way*

### Sources
The `"sources"` in the json is defined as a list of json objects. Each of these objects contains 2 fields: `"name"` and the `"list"`. The former being the name of the source. The latter is a list of standard background objects to be contained in the source. Each source generates a switch in the extension that the user can toggle to enable or disable the source of images.
```JSON
"sources": [{
    "name": "Renaissance",
    "list": [{
      "link": "https://upload.wikimedia.org/wikipedia/commons/e/ec/Mona_Lisa%2C_by_Leonardo_da_Vinci%2C_from_C2RMF_retouched.jpg",
      "title": "Mona Lisa",
      "year": "1503",
      "painter": "Leonardo Da Vinci"
    },
    {
      "link": "https://upload.wikimedia.org/wikipedia/commons/4/49/%22The_School_of_Athens%22_by_Raffaello_Sanzio_da_Urbino.jpg",
      "title": "The School of Athens",
      "year": "1509 - 1511",
      "painter": "Raphael"
    }]
  },
  {
    "name": "Impressionism",
    "list": [{
      "link": "https://upload.wikimedia.org/wikipedia/commons/5/54/Claude_Monet%2C_Impression%2C_soleil_levant.jpg",
      "title": "Impression, Sunrise",
      "year": "1872",
      "painter": "Claude Monet"
    },
    {
      "link": "https://upload.wikimedia.org/wikipedia/commons/3/30/The_Fighting_Temeraire%2C_JMW_Turner%2C_National_Gallery.jpg",
      "title": "The Fighting Temeraire",
      "year": "1839",
      "painter": "J. M. W. Turner'"
    }]
  }
]
```

The generated menu will look like this:

![generated-menu](https://i.imgur.com/hUXOkqz.png)
