package gatling.test.example.simulation

import gatling.test.example.simulation.PerfTestConfig._
import io.gatling.core.Predef.{StringBody, constantUsersPerSec, global, scenario, _}
import io.gatling.http.Predef.{http, status, _}

import scala.concurrent.duration._
import scala.language.postfixOps

class RampupGetSimulation extends Simulation {

  val httpConf = http.baseUrl(baseUrl)

  val getEndPoint = scenario("Single Get")
    .exec(http("get single root end point")
      .get("/")
      .header("Content-Type", "application/json")
      .check(status.is(200))
    )


  setUp(getEndPoint.inject(

    nothingFor(4), // 1
    atOnceUsers(10), // 2
    rampUsers(10).during(5), // 3
    constantUsersPerSec(20).during(15), // 4
    constantUsersPerSec(20).during(15).randomized, // 5
    rampUsersPerSec(10).to(20).during(10.minutes), // 6
    rampUsersPerSec(10).to(20).during(10.minutes).randomized, // 7
    stressPeakUsers(1000).during(20) // 8


  )
    .protocols(httpConf))
    .assertions(
      global.responseTime.max.lt(maxResponseTimeMs),
      global.responseTime.mean.lt(meanResponseTimeMs),
      global.responseTime.percentile3.lt(p95ResponseTimeMs),
      global.successfulRequests.percent.gt(95)
    )
}


