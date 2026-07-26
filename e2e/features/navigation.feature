Feature: Site navigation
  As a visitor
  I want to move between the main pages using the header menu
  So that I can explore the site

  Scenario: Navigating to the About page
    Given I am on the home page
    When I click the "Sobre Staretz" link in the header
    Then I should be on the about page
    And I should see the heading "Sobre Staretz"

  Scenario: Navigating back home
    Given I am on the about page
    When I click the "Inici" link in the header
    Then I should be on the home page
    And I should see 5 post previews

  Scenario: Navigating to the Blog page
    Given I am on the home page
    When I click the "Blog" link in the header
    Then I should be on the blog page
    And I should see the heading "Blog"
