Feature: Branding
  As a visitor
  I want to see the Staretz branding in the header and footer
  So that the site identity is clear on every page

  Scenario: Header displays the site title logo
    Given I am on the home page
    When I wait for the splash screen to finish
    Then I should see the header title logo

  Scenario: Footer displays the site logo
    Given I am on the home page
    When I wait for the splash screen to finish
    Then I should see the footer logo
