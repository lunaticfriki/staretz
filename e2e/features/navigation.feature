Feature: Site navigation
  As a visitor
  I want to move between the main pages using the header menu
  So that I can explore the site

  Scenario: Navigating to the About page
    Given I am on the home page
    When I click the "About" link in the header
    Then I should be on the about page
    And I should see the heading "About Staretz"

  Scenario: Navigating back home
    Given I am on the about page
    When I click the "Home" link in the header
    Then I should be on the home page
    And I should see 5 post previews
