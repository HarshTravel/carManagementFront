const firebaseConfig = {
    apiKey: "AIzaSyBCL3RC8onJ_C08_3UPq1BJGg7P730_wd0",
    authDomain: "car-management-74bff.firebaseapp.com",
    projectId: "car-management-74bff",
    storageBucket: "car-management-74bff.firebasestorage.app",
    messagingSenderId: "118697491719",
    appId: "1:118697491719:web:29792f889b1e76669a99a2",
    measurementId: "G-WCFMDHMHYM"
};

firebase.initializeApp(firebaseConfig);

let isLogin = true;

$(document).ready(function () {
    $('#authForm').on('submit', handleAuth);
    $('#switchAuthLink').on('click', toggleAuthMode);
});

function toggleAuthMode(e) {
    e.preventDefault();
    isLogin = !isLogin;
    $('#authTitle').text(isLogin ? 'Login' : 'Sign Up');
    $('#authSubmit').text(isLogin ? 'Login' : 'Sign Up');
    $('#switchAuth').html(isLogin ? 'Don\'t have an account? <a href="#" id="switchAuthLink">Sign Up</a>' : 'Already have an account? <a href="#" id="switchAuthLink">Login</a>');
    $('#switchAuthLink').on('click', toggleAuthMode);
    $('#errorMessage').text('');
}

function handleAuth(e) {
    e.preventDefault();
    const email = $('#email').val();
    const password = $('#password').val();

    if (isLogin) {
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location.href = 'index.html';
            })
            .catch((error) => {
                $('#errorMessage').text(error.message);
            });
    } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                window.location.href = 'index.html';
            })
            .catch((error) => {
                $('#errorMessage').text(error.message);
            });
    }
}

firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        if (window.location.pathname.endsWith('auth.html')) {
            window.location.href = 'index.html';
        }
    } else {
        if (!window.location.pathname.endsWith('auth.html')) {
            window.location.href = 'auth.html';
        }
    }
});