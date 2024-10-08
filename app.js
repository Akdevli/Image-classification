Dropzone.autoDiscover = false;

function init() {
    let dz = new Dropzone("#dropzone", {
        url: "/",
        maxFiles: 1,
        addRemoveLinks: true,
        dictDefaultMessage: "Some Message",
        autoProcessQueue: false
    });
    
    dz.on("addedfile", function() {
        if (dz.files[1]!=null) {
            dz.removeFile(dz.files[0]);        
        }
    });
    
    // ... (rest of your code)

    dz.on("complete", function (file) {
        let imageData = file.dataURL;
        
        var url = "http://127.0.0.1:5000//classify_image";

        $.post(url, {
            image_data: file.dataURL
        },function(data, status) {
            /* 
            */
            console.log(data);
            if (!data || data.length==0) {
                $("#resultHolder").hide();
                $("#divClassTable").hide();                
                $("#error").show();
                
            }
            /*class:"croppeddataset\\lionel_messi"
            class_dictionary: croppeddataset\lionel_messi:0, croppeddataset\maria_sharapova:1, croppeddataset\roger_federer:2, croppeddataset\serena_williams:3, croppeddataset\virat_kohli:4
            class_probability: (5) [65.56, 22.53, 4.86, 2.77, 4.27]*/
            
            let players = ["croppeddatasetlionel_messi","croppeddatasetmaria_sharapova","croppeddataset\roger_federer","croppeddatasetserena_williams","croppeddataset\u000birat_kohli"];
            let match = null;
            let bestScore = -1;
            for (let i=0 ; i<data.length ; ++i) {
                let maxScoreForThisClass = Math.max(...data[i].class_probability);
                if(maxScoreForThisClass>bestScore) {
                    match = data[i];
                    bestScore = maxScoreForThisClass;
                }
            }
            if (match) {
                $("#error").hide();
                $("#resultHolder").show();
                $("#divClassTable").show();

                $("#resultHolder").html($(`[data-player="${match.class}"`).html());
                
                let classDictionary = match.class_dictionary;
                for(let personName in classDictionary) {
                    let index = classDictionary[personName];

                    let proabilityScore = match.class_probability[index];
                    let elementName = "#score_" + personName;
                    $(elementName).html(proabilityScore);
                }
            }
            // dz.removeFile(file);            
        });
    });

    $("#submitBtn").on('click', function (e) {
        dz.processQueue();		
    });
}

$(document).ready(function() {
    console.log( "ready!" );
    $("#error").hide();
    $("#resultHolder").hide();
    $("#divClassTable").hide();

    init();
});