package com.equity.api;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(path = "/api", produces = MediaType.APPLICATION_JSON_VALUE)
public class CalcController {

    @PostMapping("/calc")
    public Map<String, Object> calc(@RequestBody Map<String, Object> body) {
        double valuation = ((Number) body.getOrDefault("valuation", 200_000_000)).doubleValue();
        double grantPercent = ((Number) body.getOrDefault("grant_percent", 0.01)).doubleValue();

        double sharesOutstanding = 100_000_000d;
        double grantShares = sharesOutstanding * grantPercent;
        double strike = valuation * 0.0001d; // demo strike formula
        double fmv = valuation / sharesOutstanding; // price per share
        double spread = Math.max(fmv - strike, 0) * grantShares;

        return Map.of(
                "grant_shares", grantShares,
                "spread_value", spread
        );
    }
}


