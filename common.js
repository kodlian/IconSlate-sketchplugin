// Sketch Plugin: Generate Icon Skate
// Source: github.com/kodlian/IconSlate-sketchplugin
// Version: 1.0

// Filename increment
FileNames = {}

function fileName(name){
    if (FileNames[name] != undefined) {
        FileNames[name] = FileNames[name] + 1
        name +='-'+FileNames[name]
    }
    else {
        FileNames[name] = 1
    }
    return name
}

// Export
function exportDoc(option) {

    // Temp folder
    var directory = NSTemporaryDirectory()
    directory +=  'sketch.iconsexport/'
    var m = [NSFileManager defaultManager]
    if ([m fileExistsAtPath:directory])
      [m removeItemAtPath:directory error:nil];
    [m createDirectoryAtPath:directory withIntermediateDirectories:false attributes:nil error:null];

    // Export PNG
    var currentPage = [doc currentPage],
    success = false

    if (option.onlyCurrentPage == true) {
        success = exportPage(currentPage, directory, option)
    }
    else {
        var pageCount = [[doc pages] count]
        for (var p = 0; p < pageCount; p++) {
            var page = [doc pages][p]
            [doc setCurrentPage:page] // Set current page to be able to export correctly the artboard

            if(exportPage(page, directory, option)) {
                success = true
            }
        }
        [doc setCurrentPage:currentPage] // Restore current page
    }

    if (success) {
        [[NSWorkspace sharedWorkspace] openFile:directory]
    }

    return success
}
function exportPage(page, directory, option) {
    var artboardCount = [[page artboards] count],
    success = false

    var name = [page name]
    name = fileName(name)

    var pageDirectory = directory + '/' + name + '/'

    // Export each artboards within the page
    for (var a = 0; a < artboardCount; a++) {
        var artboard = [page artboards][a]
        var artboardName = [artboard name]
        artboardName = fileName(artboardName)
        var artboardFilename = pageDirectory
        if ( option.combineArtboard == false ) {  // Save artboards directly inside the page folder
            artboardFilename += artboardName +'/'
        }
        artboardFilename += artboardName+'.png'
        [doc saveArtboardOrSlice:artboard toFile:artboardFilename]
        success = true
    }

    return success
}

function showAlert(message) {
    var app = [NSApplication sharedApplication];
    [app displayDialog:message withTitle: "Icon Slate"]
}

// Main
function main(option) {
      try {
          if (!exportDoc(option)){
              showAlert("There is nothing to export. Create at least one artboard.")
              return
          }
      } catch(e) {
          log(e)
      }
}
