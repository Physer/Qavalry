@corporate
Feature: General functionality

    # As a visitor of the website
    # I want to use various general functionalities provided by the site
    @corporate
    Scenario: Visited the homepage
        Given I have visited '/'
        Then I expect that the url is 'https://www.example.com/'
        And I expect that the title is "Example Domain"
