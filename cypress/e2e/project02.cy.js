/// <reference types="cypress" />

describe("Homework02 - Cypress-Project-02", () => {
  beforeEach(() => {
    cy.visit("https://techglobal-training.com/frontend/project-2");
  });

  const logData = ["TechGlobal", "Test1234"];
  const testCases = [
    {
      description: "Validate the invalid login with the wrong username",
      login: "John",
      password: "Test1234",
      message: "Invalid Username entered!",
    },
    {
      description: "Validate the invalid login with the wrong password",
      login: "TechGlobal",
      password: "1234",
      message: "Invalid Password entered!",
    },
    {
      description: "Validate the invalid login with the wrong username and password",
      login: "John",
      password: "1234",
      message: "Invalid Username entered!",
    },
  ];

  const testLogin = (username, password) => {
    cy.get('#username').clear().type(username);
    cy.get('#password').clear().type(password);
    cy.get('#login_btn').click();
  };

  it("Test Case 01 - Validate the login form", () => {

    cy.get('#username, #password').each((el) => {
      cy.wrap(el).should('be.visible')
        .and('not.have.attr', 'required');
    });
    // cy.get('#username, #password')
    //   .should('be.visible')
    //   .and('not.have.attr', 'required');

    const labels = ["Please enter your username", "Please enter your password"];

    cy.get('[for="username"], [for="password"]').each((el, i) => {
      cy.wrap(el).should('have.text', labels[i]);
    });

    cy.get('#login_btn')
      .should('be.visible')
      .and('be.enabled')
      .and('have.text', 'LOGIN');

    cy.get('[href="/frontend/project-2"]').last()
      .should('be.visible')
      .and('have.text', 'Forgot Password?')
      .click()
      .then(() => {
        cy.get('.modal-card').should('be.visible');
      });
  });

  it("Test Case 02 - Validate the valid login", () => {

    testLogin(logData[0], logData[1]);
    cy.get('#success_lgn')
      .should('be.visible');

    cy.get("#logout")
      .should('be.visible')
      .and('have.text', 'LOGOUT')
  });

  it("Test Case 03 - Validate the logout", () => {

    testLogin(logData[0], logData[1]);

    cy.get("#logout")
      .click();

    cy.get('[for="username"], [for="password"]').each((el) => {
      cy.wrap(el).should('be.visible');
    });
  });

  it("Test Case 04 - Validate the Forgot Password? Link and Reset Password modal", () => {

    const locators = ["#modal_title", ".delete", "#email", "#submit"];

    cy.get('a[href="/frontend/project-2"]').last()
      .click();

    locators.forEach(locator => {
      cy.get(locator)
        .should('be.visible');
    });

    cy.get('[for="email"]')
      .should('have.text', "Enter your email address and we'll send you a link to reset your password. ");
    cy.get('#submit')
      .should('be.enabled')
      .and('have.text', "SUBMIT");
  });

  it("Test Case 05 - Validate the Reset Password modal close button", () => {

    cy.get('[href="/frontend/project-2"]').last()
      .click();
    cy.get('#sub_heading').should('be.visible');
    cy.get('.delete').click()
      .then(() => {
        cy.get('.modal-card').should('not.exist');
      });
  });

  it("Test Case 06 - Validate the Reset Password form submission", () => {

    cy.get('[href="/frontend/project-2"]').last()
      .click();
    cy.get('#email').type('john.doe@gmail.com');
    cy.get('#submit').click()
      .then(() => {
        cy.get('#confirmation_message').should('have.text', 'A link to reset your password has been sent to your email address.');
      });
  });

  it("Test Case 07 - Validate the invalid login with the empty credentials", () => {

    cy.get('#login_btn').click();
    cy.get('#error_message').should('have.text', 'Invalid Username entered!');

  });

  testCases.forEach((test, index) => {
    it(`Test Case ${index === 2 ? '' : 0}${index + 8} - ${test.description}`, () => {

      testLogin(test.login, test.password);
      cy.get('#error_message').should('have.text', `${test.message}`);
    });
  });
});


