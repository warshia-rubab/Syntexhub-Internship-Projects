<?php
// ============================================
// LOG VIEWER - phpMyAdmin Style
// ============================================

// ✅ Force no cache (remove after testing)
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

// Database connection
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'user_management_logs';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}

// Get filter parameters
$level = isset($_GET['level']) ? $_GET['level'] : '';
$search = isset($_GET['search']) ? $_GET['search'] : '';
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 1000; // ✅ DEFAULT 1000

// Build query
$sql = "SELECT * FROM logs WHERE 1=1";
$params = [];

if ($level) {
    $sql .= " AND level = :level";
    $params[':level'] = $level;
}

if ($search) {
    $sql .= " AND (message LIKE :search OR data LIKE :search)";
    $params[':search'] = "%$search%";
}

$sql .= " ORDER BY timestamp DESC LIMIT :limit";
$stmt = $pdo->prepare($sql);
$stmt->bindParam(':limit', $limit, PDO::PARAM_INT);

foreach ($params as $key => $value) {
    $stmt->bindParam($key, $value);
}

$stmt->execute();
$logs = $stmt->fetchAll(PDO::FETCH_ASSOC);

// Get stats
$stmt = $pdo->query("SELECT COUNT(*) as total FROM logs");
$total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];

$stmt = $pdo->query("SELECT level, COUNT(*) as count FROM logs GROUP BY level");
$levels = $stmt->fetchAll(PDO::FETCH_ASSOC);

$stmt = $pdo->query("SELECT COUNT(*) as last_24h FROM logs WHERE timestamp > DATE_SUB(NOW(), INTERVAL 24 HOUR)");
$last24h = $stmt->fetch(PDO::FETCH_ASSOC)['last_24h'];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Log Viewer - phpMyAdmin Style</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <style>
        /* ... your existing styles ... */
    </style>
</head>
<body>

    <!-- Header -->
    <div class="pma-header">
        <div class="container-fluid">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <span class="brand">
                        <i class="fas fa-database"></i>
                        phpMyAdmin Log Viewer
                    </span>
                    <span class="badge bg-secondary ms-2">v1.0</span>
                </div>
                <div class="col-md-6 text-end">
                    <span class="text-light-50 me-3">
                        <i class="fas fa-clock"></i> <?= date('Y-m-d H:i:s') ?>
                    </span>
                    <button class="btn btn-sm btn-outline-light" onclick="location.reload()">
                        <i class="fas fa-sync"></i> Refresh
                    </button>
                </div>
            </div>
        </div>
    </div>

    <!-- Main -->
    <div class="container-fluid p-0">
        <div class="row g-0">
            <!-- Sidebar -->
            <div class="col-md-2 pma-sidebar">
                <div class="nav flex-column nav-pills">
                    <a class="nav-link active" href="#">
                        <i class="fas fa-list"></i> All Logs
                    </a>
                    <a class="nav-link" href="?level=ERROR">
                        <i class="fas fa-exclamation-circle text-danger"></i> Errors
                    </a>
                    <a class="nav-link" href="?level=WARNING">
                        <i class="fas fa-exclamation-triangle text-warning"></i> Warnings
                    </a>
                    <a class="nav-link" href="?level=INFO">
                        <i class="fas fa-info-circle text-info"></i> Info
                    </a>
                    <a class="nav-link" href="?level=DEBUG">
                        <i class="fas fa-bug text-success"></i> Debug
                    </a>
                    <hr class="border-secondary">
                    <a class="nav-link" href="#" onclick="clearLogs()">
                        <i class="fas fa-trash text-danger"></i> Clear Logs
                    </a>
                    <a class="nav-link" href="../viewer.html">
                        <i class="fas fa-eye"></i> Modern View
                    </a>
                </div>
            </div>

            <!-- Content -->
            <div class="col-md-10 pma-content">
                <!-- Stats -->
                <div class="row">
                    <div class="col-md-3">
                        <div class="stat-card">
                            <div class="icon"><i class="fas fa-file-alt"></i></div>
                            <div class="number"><?= $total ?></div>
                            <div class="label">Total Logs</div>
                        </div>
                    </div>
                    <div class="col-md-3">
                        <div class="stat-card blue">
                            <div class="icon"><i class="fas fa-clock"></i></div>
                            <div class="number"><?= $last24h ?></div>
                            <div class="label">Last 24 Hours</div>
                        </div>
                    </div>
                    <?php foreach ($levels as $lvl): ?>
                    <div class="col-md-2">
                        <div class="stat-card <?= $lvl['level'] === 'ERROR' ? 'red' : ($lvl['level'] === 'WARNING' ? 'yellow' : 'green') ?>">
                            <div class="number"><?= $lvl['count'] ?></div>
                            <div class="label"><?= $lvl['level'] ?></div>
                        </div>
                    </div>
                    <?php endforeach; ?>
                </div>

                <!-- Filter Bar -->
                <div class="filter-bar">
                    <form method="GET" class="row g-3 align-items-end">
                        <div class="col-md-3">
                            <label class="form-label small">Level</label>
                            <select name="level" class="form-select">
                                <option value="">All Levels</option>
                                <option value="INFO" <?= $level === 'INFO' ? 'selected' : '' ?>>INFO</option>
                                <option value="WARNING" <?= $level === 'WARNING' ? 'selected' : '' ?>>WARNING</option>
                                <option value="ERROR" <?= $level === 'ERROR' ? 'selected' : '' ?>>ERROR</option>
                                <option value="DEBUG" <?= $level === 'DEBUG' ? 'selected' : '' ?>>DEBUG</option>
                            </select>
                        </div>
                        <div class="col-md-4">
                            <label class="form-label small">Search</label>
                            <input type="text" name="search" class="form-control" placeholder="Search messages..." value="<?= htmlspecialchars($search) ?>">
                        </div>
                        <div class="col-md-2">
                            <label class="form-label small">Limit</label>
                            <select name="limit" class="form-select">
                                <option value="20" <?= $limit === 20 ? 'selected' : '' ?>>20</option>
                                <option value="50" <?= $limit === 50 ? 'selected' : '' ?>>50</option>
                                <option value="100" <?= $limit === 100 ? 'selected' : '' ?>>100</option>
                                <option value="200" <?= $limit === 200 ? 'selected' : '' ?>>200</option>
                                <option value="500" <?= $limit === 500 ? 'selected' : '' ?>>500</option>
                                <option value="1000" <?= $limit === 1000 ? 'selected' : '' ?>>1000</option>
                            </select>
                        </div>
                        <div class="col-md-3">
                            <button type="submit" class="btn btn-primary w-100">
                                <i class="fas fa-search"></i> Filter
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Log Table -->
                <div class="log-table-container">
                    <table class="log-table">
                        <thead>
                            <tr>
                                <th style="width:30px;">#</th>
                                <th style="width:170px;">Timestamp</th>
                                <th style="width:100px;">Level</th>
                                <th>Message</th>
                                <th style="width:150px;">IP</th>
                                <th style="width:80px;">User</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php if (count($logs) > 0): ?>
                                <?php $i = 1; ?>
                                <?php foreach ($logs as $log): ?>
                                <tr>
                                    <td><?= $i++ ?></td>
                                    <td><?= date('Y-m-d H:i:s', strtotime($log['timestamp'])) ?></td>
                                    <td><span class="log-level <?= $log['level'] ?>"><?= $log['level'] ?></span></td>
                                    <td>
                                        <div class="log-message"><?= htmlspecialchars($log['message']) ?></div>
                                        <?php if ($log['data']): ?>
                                            <div class="log-data"><?= htmlspecialchars($log['data']) ?></div>
                                        <?php endif; ?>
                                    </td>
                                    <td><code><?= htmlspecialchars($log['ip']) ?></code></td>
                                    <td><?= $log['user_id'] ? '<span class="badge bg-info">'.$log['user_id'].'</span>' : '<span class="text-muted">guest</span>' ?></td>
                                </tr>
                                <?php endforeach; ?>
                            <?php else: ?>
                                <tr>
                                    <td colspan="6" class="text-center text-muted py-4">
                                        <i class="fas fa-inbox fa-2x d-block mb-2"></i>
                                        No logs found
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>

                <!-- Footer Info -->
                <div class="mt-3 text-muted small d-flex justify-content-between">
                    <span>Total: <?= $total ?> log entries</span>
                    <span>Showing: <?= count($logs) ?> entries</span>
                    <span>
                        <i class="fas fa-database"></i> 
                        Database: <?= $db_name ?>
                    </span>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="pma-footer">
        <div class="container-fluid">
            <span>
                <i class="fas fa-code"></i> 
                Built with phpMyAdmin style &bull; 
                <a href="http://localhost/phpmyadmin" target="_blank">phpMyAdmin</a> &bull;
                <a href="http://localhost/phpmyadmin/db_structure.php?server=1&db=user_management_logs" target="_blank">
                    View in phpMyAdmin
                </a>
            </span>
        </div>
    </div>

    <!-- Scripts -->
    <script>
        function clearLogs() {
            if (confirm('Are you sure you want to clear all logs?')) {
                fetch('log_handler.php?action=clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ days: 0 })
                })
                .then(res => res.json())
                .then(data => {
                    alert(data.message);
                    location.reload();
                })
                .catch(err => alert('Error: ' + err.message));
            }
        }

        // Auto refresh every 10 seconds
        setTimeout(() => {
            if (!document.querySelector('.log-table tbody tr td.text-center')) {
                location.reload();
            }
        }, 10000);
    </script>
</body>
</html>