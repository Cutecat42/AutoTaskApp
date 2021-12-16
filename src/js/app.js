const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

// Get current window
let winDow = nw.Window.get();

// Get email input and enter saved email if an email already saved
let email = winDow.window.document.getElementById('emailAddress');
email.value = window.localStorage.getItem('email');

// Get password input and enter saved password if an email already saved
let password = winDow.window.document.getElementById('password');
// Remove the following line if you don't want to input saved password
password.value = window.localStorage.getItem('password');
// Uncomment below to auto select password input so user can type in password faster
// password.select();

// Get auth input to select it if email/password saved
let auth = winDow.window.document.getElementById('authcode');
auth.select();


function submitForm (e) {
    e.preventDefault();

    // Get value of inputs
    let email = winDow.window.document.getElementById('emailAddress').value;
    let password = winDow.window.document.getElementById('password').value;
    let authcode = winDow.window.document.getElementById('authcode').value;

    // Save value of email and password. Comment lines out if you don't want email and/or password to be saved
    window.localStorage.setItem('email', email);
    window.localStorage.setItem('password', password);

    // Create new window and go to AutoTask
    nw.Window.open('https://ww5.autotask.net/Mvc/Framework/Authentication.mvc/Authenticate', {}, win => win.on('loaded', function () {

        // Hide original window
        winDow.hide();
        // Set new window in center
        win.setPosition("center");

        // When new window is closed, close all windows to exit app
        win.on('close', function () {
            nw.App.quit();
        })

        // Get username input and enter email input (email)
        let user = win.window.document.querySelector("[name='UserName']");
        user.value = email
        // Update input - AutoTask thinks input is blank if this is not run
        user.dispatchEvent(new Event('input', {
            view: window,
            bubbles: true,
            cancelable: true
        }));
        // Go to next page
        win.window.document.querySelector('.Text2').click();


        function enter () {
            // Alert to tell user to press enter twice
            // Due to how AutoTask is set up, if code is used to click to go to the next page, there is an error
            // so it has to be "clicked" manually by user 
            let enter = confirm("Press enter twice in quick succession.")
            if (enter) {
                // Enters password into password input (password)
                let pass = win.window.document.querySelector("[name='Password']");
                pass.value = password
                // Update input - AutoTask thinks input is blank if this is not run
                pass.dispatchEvent(new Event('input', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));
                // User's second enter press goes to next page

                // Get auth input and enter auth input (auth)
                let auth = win.window.document.querySelectorAll('.TextBox2');
                // AutoTask requires a PIN to go before each authcode
                // If this code will be ran for only one user, then you can enter PIN here so user doesn't have to enter it each time
                // Otherwise, remove PIN and make it the following
                // auth[1].value = authcode;
                auth[1].value = 1234 + authcode;
                // Update input - AutoTask thinks input is blank if this is not run
                auth[1].dispatchEvent(new Event('input', {
                    view: window,
                    bubbles: true,
                    cancelable: true
                }));

                // Goes to next page. User is now successfully logged in
                setTimeout(() => {
                    let enter = win.window.document.querySelectorAll('.Text2');
                    enter[6].click();
                    // Maximizes window
                    win.maximize();

                    setTimeout(() => {
                        let option = {
                            // User can use the key combo of CTRL-N to create a new Autotask ticket
                            // Window has to be clicked on for it to work
                            key: "Ctrl+N",
                            active: function () {
                                win.window.document.querySelectorAll('.Button2')[6].click();
                                setTimeout(() => {
                                    nw.Window.getAll((e) => {
                                        e[2].window.document.querySelector('.Stop').click();
                                        console.log(e[2].window.document)
                                    })
                                }, 1500);

                            },
                            failed: function (msg) {
                                // :(, fail to register the |key| or couldn't parse the |key|.
                                console.log(msg);
                            }
                        };
                        //   Create shortcut with options and register it
                        let shortcut = new nw.Shortcut(option);
                        nw.App.registerGlobalHotKey(shortcut);

                        let option2 = {
                            // User can use the key combo of CTRL-S to save an Autotask ticket while editing it
                            // Window has to be clicked on for it to work
                            key: "Ctrl+S",
                            active: function () {
                                nw.Window.getAll((e) => {
                                    function querySelectorIncludesText (selector, text) {
                                        return Array.from(e[2].window.document.querySelectorAll(selector))
                                            .find(el => el.textContent.includes(text));
                                    }
                                    querySelectorIncludesText('.Button2', 'Save & Close').click()
                                })
                            },
                            failed: function (msg) {
                                // :(, fail to register the |key| or couldn't parse the |key|.
                                console.log(msg);
                            }
                        };
                        //   Create shortcut with options and register it
                        let shortcut2 = new nw.Shortcut(option2);
                        nw.App.registerGlobalHotKey(shortcut2);

                    }, 3000);

                }, 1000);

            }
            else
                // If user doesn't press enter, and instead cancels, then this quits the app completely
                nw.App.quit()
        }

        setTimeout(() => {
            // Run function from above
            enter();
        }, 800);
    }));
}

// If application shows blank, minimize app and re-open. It will refresh and user can now see AutoTask again.
