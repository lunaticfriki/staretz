Feature: Browsing and searching by category
  As a visitor
  I want to browse posts by category or search for one
  So that I can find posts on a topic I care about

  Scenario: Choosing a category from the header dropdown
    Given I am on the home page
    When I open the category menu
    And I click the "Testing" category in the menu
    Then I should be on the category page for "Testing"
    And I should see the heading "Categoria: Testing"
    And I should see 3 post previews

  Scenario: Searching for a category by typed text resolves to the matching category
    Given I am on the home page
    When I search for "front" in the category search box
    Then I should be on the category page for "Frontend"
    And I should see the heading "Categoria: Frontend"
    And I should see 5 post previews

  Scenario: Searching for a category with no matches
    Given I am on the home page
    When I search for "zzz-nomatch" in the category search box
    Then I should see 0 post previews
    And I should see the text "No s'han trobat articles"
