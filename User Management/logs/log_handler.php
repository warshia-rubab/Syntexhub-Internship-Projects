<?php
// ============================================
// LOG HANDLER - MySQL Database
// ============================================

// Set JSON headers FIRST
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
$db_host = 'localhost';
$db_user = 'root';
$db_pass = '';
$db_name = 'user_management_logs';

// Connect to database
try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Database connection failed: ' . $e->getMessage()]);
    exit();
}

// ============================================
// Write Log Function
// ============================================

function writeLog($level, $message, $data = null, $user_id = null) {
    global $pdo;
    
    $ip = $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
    $user_agent = $_SERVER['HTTP_USER_AGENT'] ?? 'Unknown';
    
    $sql = "INSERT INTO logs (level, message, data, ip, user_agent, user_id) 
            VALUES (:level, :message, :data, :ip, :user_agent, :user_id)";
    
    $stmt = $pdo->prepare($sql);
    return $stmt->execute([
        ':level' => $level,
        ':message' => $message,
        ':data' => $data ? json_encode($data) : null,
        ':ip' => $ip,
        ':user_agent' => $user_agent,
        ':user_id' => $user_id
    ]);
}

// ============================================
// Get Logs Function
// ============================================

function getLogs($limit = 100, $level = null, $search = null) {
    global $pdo;
    
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
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

// ============================================
// Clear Logs Function
// ============================================

function clearLogs($older_than_days = 30) {
    global $pdo;
    $sql = "DELETE FROM logs WHERE timestamp < DATE_SUB(NOW(), INTERVAL :days DAY)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([':days' => $older_than_days]);
    return $stmt->rowCount();
}

// ============================================
// API Handler
// ============================================

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? $_GET['action'] : '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'stats') {
                $stmt = $pdo->query("SELECT COUNT(*) as total FROM logs");
                $total = $stmt->fetch(PDO::FETCH_ASSOC)['total'];
                echo json_encode(['success' => true, 'total' => $total]);
            } else {
                $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
                $level = isset($_GET['level']) ? $_GET['level'] : null;
                $search = isset($_GET['search']) ? $_GET['search'] : null;
                echo json_encode(['success' => true, 'data' => getLogs($limit, $level, $search)]);
            }
            break;

        case 'POST':
            $input = json_decode(file_get_contents('php://input'), true);
            if (!$input) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Invalid input']);
                break;
            }
            
            $level = $input['level'] ?? 'INFO';
            $message = $input['message'] ?? 'No message';
            $data = $input['data'] ?? null;
            $user_id = $input['user_id'] ?? null;
            
            $result = writeLog($level, $message, $data, $user_id);
            echo json_encode([
                'success' => $result,
                'message' => $result ? 'Log written successfully' : 'Failed to write log'
            ]);
            break;

        case 'DELETE':
            $days = isset($_GET['days']) ? (int)$_GET['days'] : 30;
            $count = clearLogs($days);
            echo json_encode([
                'success' => true,
                'message' => "Deleted $count logs older than $days days"
            ]);
            break;

        default:
            http_response_code(405);
            echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>