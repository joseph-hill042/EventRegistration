import './general';

class Home {
  constructor() {
    this.$form = document.querySelector('#registrationForm');
    this.$username = document.querySelector('#username');
    this.$email = document.querySelector('#email');
    this.$phone = document.querySelector('#phone');
    this.$age = document.querySelector('#age');
    this.$profession = document.querySelector('#profession');
    this.$experience = document.querySelector('#experience');
    this.$comment = document.querySelector('#comment');
    this.$submit = document.querySelector('#submit');
    this.$loadingIndicator = document.querySelector('#loadingIndicator');

    this.$form.addEventListener('submit', event => {
      this.onFormSubmit(event);
    });
  }

  onFormSubmit(event) {
    event.preventDefault();
    const formValues = this.getFormValues();
    console.log(formValues);
  }

  getFormValues() {
    return {
      username: this.$username.value,
      email: this.$email.value,
      phone: this.$phone.value,
      age: this.$age.value,
      profession: this.$profession.value,
      experience: parseInt(document.querySelector('input[name="experience"]:checked').value),
      comment: this.$comment.value,
    };
  }
}

window.addEventListener('load', () => {
  new Home();
});
