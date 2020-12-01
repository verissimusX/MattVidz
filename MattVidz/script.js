// learned a lot. Learned how to do pagination. Learned how to do get requests with jQuery. before this I had only done AJAX requests and fetch requests using vanilla javascript.
// These are not my original projects(projects I made form tutorails) I want to include them to show what I have been exposed to and even thoiugh I might not have created them from scratch they exposed me to things I had never seen befoe (.data() for example).
//A good way for me to learn is to take something that is above my head and piece it together and as I go I will internalize some of the more basic concepts and eventually come to grasp to more complex ones.
//had never heard of fancybox/fancyapps and this tutorial/project introduced me to it.
//also found out that fancy box was deprecated and the new plug-in is fancy apps. I had to sort out on my own how to get it up and running like in the tutorial but since he used fancybox I was on my own in getting it implemented. youtube, github, stack overflow
//GET request when embedding video and bringing up while on same page is blocked by client so finished product will ultimately take to youtube.
$(document).ready(function(){
    //searchbar handler
    const searchField = $('#query');
    const searchButton = $('#search-button');

    //focus event handler
    $(searchField).on("focus" , animateFocus);

    function animateFocus() {
        $(this).animate({
            width: '100%'
        }, 400);
        $(searchButton).animate({
            right: '10px'
        }, 400);
    };

    //Blur event handler
    $(searchField).on("blur" , originalSearchBar);

    function originalSearchBar() {
       if(searchField.val() === "") {
           $(searchField).animate({
               width: '45%'
           }, 400,)
           $(searchButton).animate({
               right: '360px'
           }, 400);
       };
    };
    $("#search-form").submit(function(e){
        e.preventDefault()
    })
});
//grabbing the value of the search field and storing it in a variable
const queryVal = $("#query").val();

    function search(){
        //clear out results
       $("#results").html("");
       $("#buttons").html("");

        //get input from search bar field
        const queryVal = $("#query").val();


       //GET request
       $.get(
            "https://www.googleapis.com/youtube/v3/search" , {
                part : "snippet, id",
                q : queryVal,
                type: "video",
                key: "AIzaSyArA2xyYZhAn3xr1dbWtPtreNFD44KImUU"},
                function(data){
                    const nextPageToken = data.nextPageToken;
                    const prevPageToken = data.prevPageToken;

                    //I like to see the data in the console
                    console.log(data);

                    //loop through each item we get back in the data so we can display it in browser
                    $.each(data.items, function(index, item){
                        const output = getOutput(item);

                        //Display results
                        $("#results").append(output);
                    });

                    //was thinking about doing a NEXT PAGE/PREVIOUS PAGE buttons
                    const buttons = getButtons(prevPageToken, nextPageToken);

                    // display buttons
                    $("#buttons").append(buttons);
                }
       );
    }

// function to get the next page button working properly. Need to do another get request.
function nextPage() {
    //grabbing html created in the getButtons function and assigning it to a variable with either the next page token or the data that was searched itself (query)
    const token = $("#next-button").data("token")
    const query = $("#next-button").data("query")


    //clear out results
    $("#results").html("");
    $("#buttons").html("");

     //get input from search bar field
     const queryVal = $("#query").val();


    //GET request
    $.get(
         "https://www.googleapis.com/youtube/v3/search" , {
             part : "snippet, id",
             q : queryVal,
             pageToken: token,
             type: "video",
             key: "AIzaSyArA2xyYZhAn3xr1dbWtPtreNFD44KImUU"},
             function(data){
                 const nextPageToken = data.nextPageToken;
                 const prevPageToken = data.prevPageToken;

                 //I like to see the data in the console
                 console.log(data);

                 //loop through each item we get back in the data so we can display it in browser
                 $.each(data.items, function(index, item){
                     const output = getOutput(item);

                     //Display results
                     $("#results").append(output);
                 });

                 //was thinking about doing a NEXT PAGE/PREVIOUS PAGE buttons
                 const buttons = getButtons(prevPageToken, nextPageToken);

                 // display buttons
                 $("#buttons").append(buttons);
             }
    );
}

// function to get the previous page button working properly. Very similar to next page just a few tweaks Need to do another get request.
function prevPage() {
    //grabbing html created in the getButtons function and assigning it to a variable with either the prev page token or the data that was searched itself (query)
    const token = $("#prev-button").data("token")
    const query = $("#prev-button").data("query")


    //clear out results
    $("#results").html("");
    $("#buttons").html("");

     //get input from search bar field
     const queryVal = $("#query").val();


    //GET request
    $.get(
         "https://www.googleapis.com/youtube/v3/search" , {
             part : "snippet, id",
             q : queryVal,
             pageToken: token,
             type: "video",
             key: "AIzaSyArA2xyYZhAn3xr1dbWtPtreNFD44KImUU"},
             function(data){
                 const nextPageToken = data.nextPageToken;
                 const prevPageToken = data.prevPageToken;

                 //I like to see the data in the console
                 console.log(data);

                 //loop through each item we get back in the data so we can display it in browser
                 $.each(data.items, function(index, item){
                     const output = getOutput(item);

                     //Display results
                     $("#results").append(output);
                 });

                 //was thinking about doing a NEXT PAGE/PREVIOUS PAGE buttons
                 const buttons = getButtons(prevPageToken, nextPageToken);

                 // display buttons
                 $("#buttons").append(buttons);
             }
    );
}


//create the getOutput function
function getOutput(item){
    const videoId = item.id.videoId;
    const title = item.snippet.title;
    const description = item.snippet.description;
    const thumb = item.snippet.thumbnails.high.url;
    const channelTitle = item.snippet.channelTitle;
    const videoDate = item.snippet.publishedAt;

    //Build output string
    const output = `<li>
    <div class="output-left">
    <img src="${thumb}">
    </div>
    <div class="output-right">
    <h3><a href="http://www.youtube.com/embed/${videoId}"</a>${title}</h3>
    <small>By <span class="channel-title">${channelTitle}<span> on ${videoDate}</small>
    <p>${description}</p>
    </div>
    </li>`

    return output
}


// build button function
function getButtons(prevPageToken, nextPageToken) {
    const buttonOutput = `<div class="button-container">
    <button id="prev-button" class="page-button" data-token="${prevPageToken}"
    data-query="${queryVal}" onclick="prevPage()">
    Previous Page</button>
    <button id="next-button" class="page-button" data-token="${nextPageToken}"
    data-query="${queryVal}" onclick="nextPage()">
    Next Page</button>
    </div>`;

    return buttonOutput;
};
