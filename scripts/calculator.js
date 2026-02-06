/* USATaxDollars.com — Client-side tax calculator
   Replicates the original ASP.NET server-side calculation */

(function () {
  // Budget categories with original percentages
  var categories = [
    { name: "Social Security", pct: 20.54, tip: "Social Security Benefits" },
    { name: "National Defense", pct: 20.35, tip: "Military Personnel<br>Operation and Maintenance<br>Procurement<br>Research and Development<br>Military Construction<br>Family Housing<br>Atomic Energy Defense Activities<br>Defense-related Activities" },
    { name: "Medicare", pct: 13.15, tip: "Medicare Benefits" },
    { name: "Income Security", pct: 12.75, tip: "General retirement and disability insurance (excluding social security)<br>Federal employee retirement and disability<br>Unemployment compensation<br>Housing assistance<br>Food and nutrition assistance<br>Other income security" },
    { name: "Health", pct: 9.34, tip: "Health care services<br>Health research and training<br>Consumer and occupational health and safety" },
    { name: "Net Interest", pct: 8.76, tip: "Interest on Treasury debt securities (gross)<br>Interest received by on-budget trust funds<br>Interest received by off-budget trust funds<br>Other interest<br>Other investment income" },
    { name: "Education, Training, and Employment", pct: 2.82, tip: "Elementary, secondary, and vocational education<br>Higher education<br>Research and general education aids<br>Training and employment<br>Other labor services<br>Social services" },
    { name: "Veterans Benefits and Services", pct: 2.82, tip: "Income security for veterans<br>Veterans education, training, and rehabilitation<br>Hospital and medical care for veterans<br>Veterans housing<br>Other veterans benefits and services" },
    { name: "Transportation", pct: 2.64, tip: "Ground transportation<br>Air transportation<br>Water transportation<br>Other transportation" },
    { name: "Administration of Justice", pct: 1.56, tip: "Federal law enforcement activities<br>Federal litigative and judicial activities<br>Federal correctional activities<br>Criminal justice assistance" },
    { name: "International Affairs", pct: 1.17, tip: "International development and humanitarian assistance<br>International security assistance<br>Conduct of foreign affairs<br>Foreign information and exchange activities<br>International financial programs" },
    { name: "Natural Resources and Environment", pct: 1.07, tip: "Water resources<br>Conservation and land management<br>Recreational resources<br>Pollution control and abatement<br>Other natural resources" },
    { name: "General Science, Space, and Technology", pct: 0.86, tip: "General science and basic research<br>Space flight, research, and supporting activities" },
    { name: "Community and Regional Development", pct: 0.77, tip: "Community development<br>Area and regional development<br>Disaster relief and insurance" },
    { name: "Agriculture", pct: 0.68, tip: "Farm income stabilization<br>Agricultural research and services" },
    { name: "General Government", pct: 0.68, tip: "Legislative functions<br>Executive direction and management<br>Central fiscal operations<br>General property and records management<br>Central personnel management<br>General purpose fiscal assistance<br>Other general government<br>Deductions for offsetting receipts" },
    { name: "Energy", pct: 0.04, tip: "Energy supply<br>Energy conservation<br>Emergency energy preparedness<br>Energy information, policy, and regulation" }
  ];

  // Tax brackets (2016 single filer — matches original site era)
  var brackets = [
    { min: 0, max: 9275, rate: 0.10 },
    { min: 9275, max: 37650, rate: 0.15 },
    { min: 37650, max: 91150, rate: 0.25 },
    { min: 91150, max: 190150, rate: 0.28 },
    { min: 190150, max: 413350, rate: 0.33 },
    { min: 413350, max: 415050, rate: 0.35 },
    { min: 415050, max: Infinity, rate: 0.396 }
  ];

  var standardDeduction = 6300;
  var personalExemption = 4050;
  var ficaRate = 0.0765;
  var ficaCap = 118500; // SS wage base 2016

  function calculateTax(income) {
    // FICA (Social Security + Medicare)
    var ssTax = Math.min(income, ficaCap) * 0.062;
    var medicareTax = income * 0.0145;
    var fica = ssTax + medicareTax;

    // Federal income tax
    var taxableIncome = Math.max(0, income - standardDeduction - personalExemption);
    var incomeTax = 0;
    for (var i = 0; i < brackets.length; i++) {
      var b = brackets[i];
      if (taxableIncome <= b.min) break;
      var amount = Math.min(taxableIncome, b.max) - b.min;
      incomeTax += amount * b.rate;
    }

    return incomeTax + fica;
  }

  function formatCurrency(n) {
    return "$" + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  function buildResults(income) {
    var tax = calculateTax(income);
    var weekly = tax / 52;
    var monthly = tax / 12;

    // Pie chart legend colors (matching original)
    var colors = [
      "#c0392b", "#2c3e50", "#bdc3c7", "#e67e22", "#ecf0f1",
      "#f39c12", "#e74c3c"
    ];

    var html = '';
    html += '<div class="results" id="resultdiv">';
    html += '<h2 class="estimated">Your Estimated Federal Taxes:<span class="total-tax">' + formatCurrency(tax) + '</span><span class="each-year">each year</span></h2>';
    html += '<h4 class="rundown">That\'s <span>' + formatCurrency(weekly) + '</span> each week or <span>' + formatCurrency(monthly) + '</span> per month.</h4>';
    html += '<img class="three-stars img-responsive" src="Content/images/three-stars.png" />';

    html += '<div class="container"><div class="row"><div class="pie-header"><span>How the federal government spends your money</span></div></div>';

    // Breakdown table
    html += '<div class="row breakdown"><table class="table breakdown-table" width="100%" cellspacing="0" cellpadding="0">';
    html += '<tr class="tablehead"><td width="51%" class="col-detailed">Detailed Breakdown</td>';
    html += '<td width="16%" align="center" class="col-percentage">Percentage</td>';
    html += '<td width="33%" align="right">Amount</td></tr>';

    var total = 0;
    for (var i = 0; i < categories.length; i++) {
      var c = categories[i];
      var amount = (c.pct / 100) * tax;
      total += amount;
      var rowClass = (i % 2 === 0) ? "oddrow" : "evenrow";
      html += '<tr class="' + rowClass + '">';
      html += '<td>' + c.name + ' <a class="tooltip-link hidden-xs" href="javascript:void(0);" title="' + c.tip.replace(/<br>/g, '\n') + '">?</a></td>';
      html += '<td align="center" class="percentage">' + c.pct.toFixed(2) + '%</td>';
      html += '<td align="right" class="col-amount">' + formatCurrency(amount) + '</td>';
      html += '</tr>';
    }

    html += '<tr class="totalrow"><td>Total</td>';
    html += '<td align="center" class="percentage">100%</td>';
    html += '<td align="right" class="col-amount">' + formatCurrency(total) + '</td></tr>';
    html += '</table></div>';

    html += '<div class="row waitamin"><h3>Wait a minute! Where are you getting your numbers?</h3>';
    html += '<p>From the U.S. Government Printing Office (they put out <a href="http://www.gpoaccess.gov/usbudget/" target="_blank">official budget numbers</a>). ';
    html += 'We\'ve taken their confusing charts, simplified them and done the math for you so it\'s easy. ';
    html += 'We understand it\'s not 100% accurate but we\'re just trying to give everyone an idea of where their money\'s going.</p>';
    html += '<img class="three-stars img-responsive" src="Content/images/three-stars.png" />';
    html += '</div></div></div>';

    return html;
  }

  // Intercept form submission
  document.addEventListener("DOMContentLoaded", function () {
    var form = document.querySelector("form");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var input = document.getElementById("AnnualIncomeString");
      var income = parseFloat(input.value.replace(/[^0-9.]/g, ""));
      if (isNaN(income) || income <= 0) {
        alert("Please enter a valid income.");
        return;
      }

      // Format the input
      input.value = income.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

      // Remove old results
      var old = document.getElementById("resultdiv");
      if (old) old.remove();

      // Insert results after the form
      var container = document.querySelector(".container.main");
      container.insertAdjacentHTML("beforeend", buildResults(income));

      // Scroll to results
      setTimeout(function () {
        var el = document.getElementById("resultdiv");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    });
  });
})();
