Feature: Dashboard posts list
  As a logged-in admin
  I want to manage blog posts from the dashboard
  So that I can edit or delete them

  Scenario: Logging in opens the dashboard
    Given I am logged in as an admin
    Then I should be on the dashboard page
    And I should see the heading "Articles"

  Scenario: Viewing the posts list as a table on desktop
    Given I am logged in as an admin
    Then I should see the posts as a table

  Scenario: Viewing the posts list as cards on mobile
    Given my screen is mobile-sized
    And I am logged in as an admin
    Then I should see the posts as cards

  Scenario: Searching the posts list narrows the table
    Given I am logged in as an admin
    When I search for "Cubit" in the posts search box
    Then I should see 1 post in the table

  Scenario: Searching the posts list with no matches
    Given I am logged in as an admin
    When I search for "zzz-nomatch" in the posts search box
    Then I should see 0 posts in the table
    And I should see the text "No s'han trobat articles"
