Feature: Splash screen
  As a visitor
  I want to see a brief branded splash screen when I open the site
  So that the brand is introduced before the content appears

  Scenario: Splash screen appears then reveals the home page
    Given I am on the home page
    Then I should see the splash screen
    When I wait for the splash screen to finish
    Then I should not see the splash screen
    And I should see 5 post previews
