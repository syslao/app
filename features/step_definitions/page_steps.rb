When(/^I click "(.*?)"$/) do |text|
  click_on text
end

Then(/^I see a dashboard$/) do
  expect(page).to have_content("Dashboard")
end
