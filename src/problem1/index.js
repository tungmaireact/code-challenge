// Using Formula (Mathematical Approach)
var sum_to_n_a = function(n) {
    return n * (n + 1) / 2;
};

// Using for Loop (Iterative Approach)
var sum_to_n_b = function(n) {
    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }
    return sum;
};

// Using Recursion
var sum_to_n_c = function(n) {
    if (n === 1) return 1;
    return n + sum_to_n_c(n - 1);
};