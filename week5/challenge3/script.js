let link = document.getElementsByTagName("a");
for (let i = 0; i < link.length; i++) 
    {
        link[i].addEventListener("click", (event) => 
            {
                event.preventDefault();
                alert("clicked!");
            });
    }